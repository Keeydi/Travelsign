# Android Camera Permission Fix Guide

## Issue: Camera doesn't show up and no permission request on Android

## ✅ Fixes Applied

### 1. Updated `app.json`
- Added explicit Android camera permissions
- Added package name for Android

### 2. Improved `ScanScreen.tsx`
- Better permission request logic
- Automatic permission request on screen load
- Manual permission request button
- Ability to open Android settings
- Better error handling and logging

## 🔧 Additional Steps Required

### If using Expo Go:
**Important:** Expo Go has limitations with native permissions. You may need to:

1. **Create a Development Build:**
   ```bash
   npx expo prebuild
   npx expo run:android
   ```

2. **Or use EAS Build:**
   ```bash
   npm install -g eas-cli
   eas build --profile development --platform android
   ```

### If using Development Build or Standalone App:

1. **Rebuild the app after changes:**
   ```bash
   # Clear cache and rebuild
   npx expo start --clear
   # Then rebuild Android
   npx expo run:android
   ```

2. **Check AndroidManifest.xml** (if using prebuild):
   - Ensure `<uses-permission android:name="android.permission.CAMERA" />` is present
   - This should be auto-generated from `app.json`

### Manual Testing Steps:

1. **Check if permission is being requested:**
   - Open the app
   - Navigate to Scan screen
   - Check console logs for permission state
   - Look for Android permission dialog

2. **If permission dialog doesn't appear:**
   - Go to Android Settings → Apps → TravelSignAr → Permissions
   - Manually enable Camera permission
   - Return to app and try again

3. **If camera still doesn't show:**
   - Check device logs: `adb logcat | grep -i camera`
   - Check Expo logs for errors
   - Verify `expo-camera` version is compatible

## 🐛 Debugging

### Enable Debug Logging:
The updated code includes console logs. Check your terminal/console for:
- `ScanScreen: Permission state:`
- `ScanScreen: Requesting camera permission...`
- `ScanScreen: Camera permission result:`

### Common Issues:

1. **Permission dialog not showing:**
   - App might have been denied previously
   - Go to Settings → Apps → TravelSignAr → Permissions → Reset
   - Or uninstall and reinstall the app

2. **Camera view is black:**
   - Permission might be granted but camera not initializing
   - Check if other apps can use camera
   - Restart the device

3. **"Permission denied" immediately:**
   - User might have denied permission permanently
   - Need to open Settings manually
   - The app now includes "Open Settings" button

## 📱 Testing Checklist

- [ ] App requests permission on first launch
- [ ] Permission dialog appears
- [ ] Camera view shows after granting permission
- [ ] "Open Settings" button works if permission denied
- [ ] App handles permission denial gracefully
- [ ] Console logs show permission state correctly

## 🔄 Next Steps

1. **Test the updated code:**
   ```bash
   npx expo start --clear
   ```

2. **If using Expo Go and it still doesn't work:**
   - Create a development build (see above)
   - Expo Go has known limitations with native modules

3. **If using development build:**
   - Rebuild the app after these changes
   - Permissions in `app.json` require a rebuild

4. **Check the logs:**
   - Look for permission-related messages
   - Check for any errors in the console

## 📝 Notes

- Android 13+ requires runtime permissions
- Expo Go may not fully support all native permissions
- Development builds are recommended for testing permissions
- The app now automatically requests permission on screen load
- Users can manually request permission via the button

