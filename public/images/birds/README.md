# Bird Images Directory

This folder contains all the bird images for the Bird Collection App.

## Organization

You can organize your bird images in the following ways:

### Option 1: Flat Structure

```
birds/
├── cardinal-main.jpg
├── cardinal-male.jpg
├── cardinal-female.jpg
├── owl-main.jpg
├── owl-hunting.jpg
└── ...
```

### Option 2: Organized by Bird (Recommended)

```
birds/
├── cardinal/
│   ├── main.jpg
│   ├── male.jpg
│   └── female.jpg
├── owl/
│   ├── main.jpg
│   └── hunting.jpg
└── ...
```

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Main Image**: Aspect ratio around 3:4 (portrait) works best for cards
- **Additional Images**: Square aspect ratio (1:1) recommended for detail view
- **Size**: Recommended 800px+ on the longest side for good quality

## Usage in Code

Update the `shared/birds.ts` file to reference your images:

```typescript
imageUrl: '/images/birds/cardinal-main.jpg',
additionalImages: [
  '/images/birds/cardinal-male.jpg',
  '/images/birds/cardinal-female.jpg'
]
```

Or with organized folders:

```typescript
imageUrl: '/images/birds/cardinal/main.jpg',
additionalImages: [
  '/images/birds/cardinal/male.jpg',
  '/images/birds/cardinal/female.jpg'
]
```
