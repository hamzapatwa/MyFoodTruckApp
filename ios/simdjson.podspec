Pod::Spec.new do |s|
  s.name         = "simdjson"
  s.version      = "3.1.0"
  s.summary      = "Parsing gigabytes of JSON per second"
  s.description  = "A C++ library for parsing JSON using SIMD instructions"
  s.homepage     = "https://github.com/simdjson/simdjson"
  s.license      = { :type => "Apache License 2.0" }
  s.author       = { "Daniel Lemire" => "lemire@gmail.com" }
  s.source       = { :git => "https://github.com/simdjson/simdjson.git", :tag => "v#{s.version}" }
  s.platforms    = { :ios => "11.0", :tvos => "11.0" }
  
  # Use the extracted simdjson files
  s.source_files = "../../simdjson-3.1.0/include/**/*.h", "../../simdjson-3.1.0/src/**/*.cpp"
  s.public_header_files = "../../simdjson-3.1.0/include/**/*.h"
  s.header_mappings_dir = "../../simdjson-3.1.0/include"
  
  s.compiler_flags = '-Os'
  s.requires_arc = true
end