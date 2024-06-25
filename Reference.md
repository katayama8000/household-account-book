## Supabase

### generate type
```bash
PROJECT_REF="" ./generate_types.sh
```

### schema
- https://supabase-schema.vercel.app/

## Expo

### Config
- verify which configuration will be embedded
```bash
npx expo config --type public
```

### Build
- eas build
```bash
eas build --platform android --profile development --non-interactive --no-wait
```

### Check secret list
```bash
eas secret:list
```
