plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.niyazi.kasayonetimi"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.niyazi.kasayonetimi"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
}
