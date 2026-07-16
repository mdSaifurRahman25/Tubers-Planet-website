thumblify-next/
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── logo/
│   └── placeholders/
│
├── src/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── providers.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   │
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   │
│   │   │   ├── generate/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── my-generation/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── preview/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   │   └── route.ts
│   │       │   ├── logout/
│   │       │   │   └── route.ts
│   │       │   ├── register/
│   │       │   │   └── route.ts
│   │       │   └── session/
│   │       │       └── route.ts
│   │       │
│   │       ├── thumbnails/
│   │       │   ├── route.ts
│   │       │   ├── generate/
│   │       │   │   └── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       │
│   │       └── users/
│   │           └── me/
│   │               └── route.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── LenisProvider.tsx
│   │   │   └── ToastProvider.tsx
│   │   │
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── TestimonialSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── CTASection.tsx
│   │   │
│   │   ├── thumbnail/
│   │   │   ├── PreviewPanel.tsx
│   │   │   ├── TitleImage.tsx
│   │   │   ├── AspectRatioSelector.tsx
│   │   │   ├── ColorSchemeSelector.tsx
│   │   │   └── StyleSelector.tsx
│   │   │
│   │   ├── auth/
│   │   │   └── LoginForm.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Spinner.tsx
│   │       └── SectionTitle.tsx
│   │
│   ├── actions/
│   │   ├── auth.actions.ts
│   │   └── thumbnail.actions.ts
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   └── connect-db.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── session.ts
│   │   │   ├── password.ts
│   │   │   ├── get-current-user.ts
│   │   │   └── require-user.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── client.ts
│   │   │   ├── generate-thumbnail.ts
│   │   │   └── prompt-builder.ts
│   │   │
│   │   ├── storage/
│   │   │   ├── image-storage.ts
│   │   │   └── delete-image.ts
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── thumbnail.service.ts
│   │   │   └── user.service.ts
│   │   │
│   │   ├── repositories/
│   │   │   ├── user.repository.ts
│   │   │   └── thumbnail.repository.ts
│   │   │
│   │   ├── validations/
│   │   │   ├── auth.schema.ts
│   │   │   └── thumbnail.schema.ts
│   │   │
│   │   ├── api/
│   │   │   ├── api-response.ts
│   │   │   └── api-error.ts
│   │   │
│   │   └── utils/
│   │       ├── format-date.ts
│   │       └── generate-file-name.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Thumbnail.ts
│   │   └── Session.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useThumbnail.ts
│   │
│   ├── data/
│   │   ├── features.ts
│   │   ├── pricing.ts
│   │   ├── testimonials.ts
│   │   ├── navlinks.ts
│   │   └── footer.ts
│   │
│   ├── config/
│   │   ├── site.ts
│   │   └── env.ts
│   │
│   └── types/
│       ├── auth.types.ts
│       ├── thumbnail.types.ts
│       └── api.types.ts
│
├── .env.local
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── proxy.ts
├── tsconfig.json
└── README.md