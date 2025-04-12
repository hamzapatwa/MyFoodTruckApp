require "json"

package = JSON.parse(File.read(File.join(__dir__, '../node_modules/@nozbe/watermelondb/package.json')))

Pod::Spec.new do |s|
  s.name         = "WatermelonDB"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.author       = { "author" => package["author"] }
  s.platforms    = { :ios => "11.0", :tvos => "11.0" }
  s.source = { :git => "https://github.com/Nozbe/WatermelonDB.git", :tag => "v#{s.version}" }
  s.source_files = "../node_modules/@nozbe/watermelondb/native/ios/**/*.{h,m,mm,swift,c,cpp}", "../node_modules/@nozbe/watermelondb/native/shared/**/*.{h,c,cpp}"
  s.public_header_files = [
    # FIXME: I don't think we should be exporting all headers as public
    # (although that is CocoaPods default behavior)
    # but this is needed for WatermelonDB to work in use_frameworks! mode
    # 'native/ios/**/*.h',
    '../node_modules/@nozbe/watermelondb/native/ios/WatermelonDB/JSIInstaller.h',
    '../node_modules/@nozbe/watermelondb/native/ios/WatermelonDB/WatermelonDB.h',
  ]
  s.pod_target_xcconfig = {
    # FIXME: This is a workaround for broken build in use_frameworks mode
    # I don't think this is a correct fix, but… seems to work?
    # 'OTHER_SWIFT_FLAGS' => '-Xcc -Wno-error=non-modular-include-in-framework-module'
  }
  s.requires_arc = true
  # simdjson is annoyingly slow without compiler optimization, disable for debugging
  s.compiler_flags = '-Os'

  s.dependency "React"

  s.libraries = 'sqlite3'

  # NOTE: This dependency doesn't seem to be needed anymore (tested on RN 0.66, 0.71), file an issue
  # if this causes issues for you
  # s.dependency "React-jsi"

  # NOTE: We're manually including simdjson files in the Xcode project
  # s.dependency "simdjson"
end