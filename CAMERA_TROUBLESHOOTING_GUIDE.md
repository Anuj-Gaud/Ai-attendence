# Camera Troubleshooting Guide 🎥

## Issue: Camera Not Working / Black Screen

The user is still experiencing camera access issues. Here's a comprehensive troubleshooting approach:

## Step 1: Test with Simple Camera Component

I've created a minimal camera test component. Access it at:
```
http://localhost:3000/test/simple-camera
```

This component:
- Uses the simplest possible camera constraints
- Provides detailed error messages
- Shows system status and browser info
- Has comprehensive logging in browser console

## Step 2: Browser-Specific Troubleshooting

### Chrome/Edge:
1. **Check Site Permissions**:
   - Click the camera icon in address bar
   - Ensure camera is set to "Allow"
   - Try refreshing the page

2. **Reset Site Permissions**:
   - Go to `chrome://settings/content/camera`
   - Find your localhost site and remove it
   - Reload page and allow permissions again

### Firefox:
1. **Check Permissions**:
   - Click the shield icon in address bar
   - Ensure camera permissions are granted
   - Try in private browsing mode

### Safari:
1. **HTTPS Requirement**:
   - Safari requires HTTPS for camera access
   - Try using `https://localhost:3000` instead
   - Or test in Chrome/Firefox first

## Step 3: System-Level Troubleshooting

### Windows:
1. **Camera Privacy Settings**:
   - Go to Settings > Privacy & Security > Camera
   - Ensure "Camera access" is ON
   - Ensure "Let apps access your camera" is ON
   - Ensure "Let desktop apps access your camera" is ON

2. **Close Other Applications**:
   - Close Zoom, Teams, Skype, OBS, etc.
   - Check Task Manager for any camera-using processes

3. **Update Camera Drivers**:
   - Go to Device Manager
   - Find your camera under "Cameras" or "Imaging devices"
   - Right-click and "Update driver"

### Hardware Check:
1. **Test Camera in Other Apps**:
   - Open Windows Camera app
   - Try video calling apps
   - Ensure camera physically works

## Step 4: Browser Console Debugging

1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Try the simple camera test**
4. **Look for error messages**

Common error patterns:
- `NotAllowedError`: Permission denied
- `NotFoundError`: No camera detected
- `NotReadableError`: Camera in use by another app
- `OverconstrainedError`: Camera doesn't support requested settings

## Step 5: Alternative Testing Methods

### Test 1: Direct Browser Camera Test
Open browser console and run:
```javascript
navigator.mediaDevices.getUserMedia({video: true})
  .then(stream => {
    console.log('SUCCESS:', stream);
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(error => console.error('FAILED:', error));
```

### Test 2: Check Available Devices
```javascript
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    const cameras = devices.filter(d => d.kind === 'videoinput');
    console.log('Cameras found:', cameras);
  });
```

## Step 6: Fallback Solutions

If camera still doesn't work:

1. **Try Different Browser**: Chrome usually works best
2. **Try Incognito/Private Mode**: Bypasses extensions
3. **Disable Browser Extensions**: Some extensions block camera
4. **Try Different USB Port**: For external cameras
5. **Restart Browser**: Clear any stuck camera processes
6. **Restart Computer**: Reset all camera processes

## Step 7: Development Server Issues

### HTTPS Requirement:
Some browsers require HTTPS for camera access. Try:
```bash
# In frontend directory
npm run dev -- --https
```

Or use a tool like `ngrok` to create HTTPS tunnel:
```bash
npx ngrok http 3000
```

## Testing Instructions

1. **Go to Simple Camera Test**: `http://localhost:3000/test/simple-camera`
2. **Click "Check Devices"** to see available cameras
3. **Click "Start Camera"** and allow permissions
4. **Check browser console** for detailed logs
5. **If it works here**, the issue is in the main app
6. **If it doesn't work**, it's a system/browser issue

## Expected Results

✅ **Working Camera Should Show**:
- Live video feed of yourself
- "Streaming: Yes" in status
- No error messages
- Console logs showing successful camera initialization

❌ **Common Failure Signs**:
- Black screen with no video
- Permission denied errors
- "No camera found" messages
- Browser asking for permissions but camera still not working

## Next Steps Based on Results

### If Simple Test Works:
- Issue is in the main SecureAttendance component
- Need to debug the complex camera implementation

### If Simple Test Fails:
- System/browser level issue
- Follow hardware/permission troubleshooting steps
- Try different browser or device

## Contact Information

If none of these steps work, please provide:
1. **Browser and version** (Chrome 120, Firefox 115, etc.)
2. **Operating System** (Windows 11, macOS, etc.)
3. **Error messages** from browser console
4. **Camera type** (built-in laptop, USB webcam, etc.)
5. **Results from simple camera test**

This will help identify the specific issue and provide targeted solutions.