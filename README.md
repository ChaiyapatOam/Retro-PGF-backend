# Retro PGF Backend

This Repository is a boilerplate to build a RESTful API with Express.js and Prisma 

## Usage

- To install package

```bash
npm install
```

- To start development

```bash
npm run dev
```

- To start production

```bash
npm run build
npm run start
```

- To work with prisma

```bash
npx prisma generate
npx prisma migrate dev
```

## Folder Structure

```md
.
├── 📂prisma/
│ └── schema.prisma
├── 📂src/
│ ├── 📂controller/
│ │ └── user.controller.ts
│ ├── 📂lib/
│ │ └── prisma.ts
│ ├── 📂middleware/
│ │ └── auth.ts
│ ├── 📂routes/
│ │ ├── index.ts
│ │ └── user.route.ts
│ ├── 📂types/
│ │ ├── 📂express/
│ │ │ └── index.ts
│ │ └── index.ts
│ └── server.ts
├── .env.example
├── package.json
├── pnpm-lock.yaml
├── README.md
└── tsconfig.json
```
