src/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx
│   │
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── generate/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── my-generation/
│   │   │   └── page.tsx
│   │   │
│   │   └── preview/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   └── session/
│   │   │       └── route.ts
│   │   │
│   │   ├── thumbnails/
│   │   │   ├── route.ts
│   │   │   ├── generate/
│   │   │   │   └── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   │
│   │   └── users/
│   │       └── me/
│   │           └── route.ts
│   │
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── layout/
│   ├── sections/
│   ├── thumbnail/
│   ├── auth/
│   ├── providers/
│   └── ui/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── ai/
│   ├── services/
│   ├── repositories/
│   ├── validations/
│   ├── storage/
│   ├── api/
│   └── utils/
│
├── models/
├── hooks/
├── data/
├── config/
└── types/



src/
├── app/
│   └── api/
│       ├── auth/
│       ├── thumbnails/
│       └── users/
│
├── lib/
│   ├── db/
│   │   └── connect-db.ts
│   ├── ai/
│   │   └── gemini.ts
│   ├── cloudinary/
│   │   └── cloudinary.ts
│   ├── auth/
│   ├── services/
│   └── validations/
│
└── models/
    ├── User.ts
    ├── Thumbnail.ts
    └── Session.ts

    CREATE
src/components/thumbnail/ReferenceImageUploader.tsx
src/lib/images/read-reference-image.ts

UPDATE
src/components/thumbnail/GenerateWorkspace.tsx
src/app/api/thumbnails/[id]/enhance/route.ts
src/lib/services/generate-thumbnail-image.ts