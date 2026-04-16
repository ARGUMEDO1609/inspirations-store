namespace :db do
  desc "Mark existing schema as migrated when tables already exist but schema_migrations is out of sync"
  task sync_schema_migrations: :environment do
    connection = ActiveRecord::Base.connection
    migration_context = connection.migration_context
    applied_versions = migration_context.get_all_versions
    pending_migrations = migration_context.migrations.reject do |migration|
      applied_versions.include?(migration.version)
    end

    if pending_migrations.empty?
      puts "No pending migrations."
      next
    end

    expected_schema = {
      "categories" => %w[name slug description],
      "products" => %w[title description price stock category_id slug],
      "users" => %w[email encrypted_password reset_password_token role],
      "orders" => %w[user_id status total shipping_address payment_id payment_status payment_method reference],
      "order_items" => %w[order_id product_id quantity unit_price],
      "cart_items" => %w[user_id product_id quantity],
      "jwt_denylist" => %w[jti exp],
      "admin_users" => %w[email encrypted_password reset_password_token],
      "active_admin_comments" => %w[namespace body resource_type resource_id author_type author_id],
      "active_storage_blobs" => %w[key filename service_name byte_size],
      "active_storage_attachments" => %w[name record_type record_id blob_id],
      "active_storage_variant_records" => %w[blob_id variation_digest],
      "reviews" => %w[user_id reviewable_type reviewable_id rating],
      "addresses" => %w[addressable_type addressable_id address_line_1 city country address_type],
      "notes" => %w[notable_type notable_id admin_user_id body],
      "payments" => %w[order_id provider transaction_id status]
    }

    missing_tables = expected_schema.keys.reject { |table| connection.data_source_exists?(table) }
    if missing_tables.any?
      abort <<~MSG
        Refusing to backfill schema migrations because these tables are missing:
        #{missing_tables.join(", ")}

        Run `bin/rails db:migrate` on a fresh database, or restore the missing tables before retrying.
      MSG
    end

    missing_columns = expected_schema.each_with_object([]) do |(table, columns), errors|
      existing_columns = connection.columns(table).map(&:name)
      absent_columns = columns - existing_columns
      next if absent_columns.empty?

      errors << "#{table}: #{absent_columns.join(", ")}"
    end

    if missing_columns.any?
      abort <<~MSG
        Refusing to backfill schema migrations because some expected columns are missing:
        #{missing_columns.join("\n")}

        The database does not match the current application schema closely enough to mark migrations as applied.
      MSG
    end

    ActiveRecord::SchemaMigration.create_table
    applied_versions = ActiveRecord::SchemaMigration.all.pluck(:version)
    inserted_versions = []

    pending_migrations.each do |migration|
      version = migration.version.to_s
      next if applied_versions.include?(version)

      ActiveRecord::SchemaMigration.create!(version: version)
      inserted_versions << version
    end

    if inserted_versions.empty?
      puts "schema_migrations was already up to date."
    else
      puts "Inserted #{inserted_versions.size} migration versions into schema_migrations:"
      inserted_versions.each { |version| puts "  #{version}" }
    end
  end
end
