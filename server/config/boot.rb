ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

dotenv_path = File.expand_path("../.env", __dir__)
if File.exist?(dotenv_path)
  File.foreach(dotenv_path) do |line|
    line = line.strip
    next if line.empty? || line.start_with?("#")

    key, value = line.split("=", 2)
    next unless key && value

    value = value.split("#", 2).first.strip
    if value.start_with?('"') && value.end_with?('"')
      value = value[1..-2]
    elsif value.start_with?("'") && value.end_with?("'")
      value = value[1..-2]
    end

    ENV[key] ||= value
  end
end

require "bundler/setup" # Set up gems listed in the Gemfile.
# require "bootsnap/setup" # Speed up boot time by caching expensive operations.
