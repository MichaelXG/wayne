# Camera Feed Videos

This folder should contain the following video files for the city monitoring system:

1. `gotham-streets.mp4` - Downtown street surveillance
2. `gotham-harbor.mp4` - Harbor and docks area
3. `gotham-park.mp4` - Robinson Park surveillance
4. `gotham-square.mp4` - Gotham Square central area
5. `arkham-gates.mp4` - Arkham Asylum entrance
6. `ice-lounge-ext.mp4` - Iceberg Lounge exterior

## Video Requirements

- Format: MP4
- Resolution: 1920x1080 (Full HD) or 1280x720 (HD)
- Duration: 30-60 seconds
- Codec: H.264
- Audio: Optional

## Git LFS Setup

Since these video files are large, we use Git LFS (Large File Storage) to manage them efficiently:

1. Install Git LFS:
```bash
git lfs install
```

2. Track MP4 files:
```bash
git lfs track "*.mp4"
```

3. Add videos to this folder and commit normally:
```bash
git add .
git commit -m "Add surveillance videos"
git push origin main
```

## Video Sources

For development and testing, you can use any appropriate night city footage that matches the dark/noir aesthetic of Gotham City. Make sure you have the rights to use the videos or they are properly licensed for your use case. 