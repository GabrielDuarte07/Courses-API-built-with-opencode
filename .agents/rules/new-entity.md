# New Entity

This rule describes how to create a new entity in the API. Follow it whenever a prompt asks to add a new entity.

If the prisma dependency is not installed, install it and init it using the project package manager.

## Steps

1. **Create the entity in the database (Prisma + SQLite)**
   - Add the new model to the Prisma schema using `prisma` with SQLite as the provider.
   - Every entity MUST include the following base columns:
     - `id` — primary key, type `String @id @default(uuid())`
     - `createdAt` — type `DateTime @default(now())`
     - `updatedAt` — type `DateTime @updatedAt`
   - Additional columns and references (relations/foreign keys) will be detailed in the prompt.
   - After updating the schema, create the migration and apply it to the database.

2. **Create the API entity folder inside `/src`**
   - The folder MUST follow the model structure directory:
     ```
     /src
     └── {$entityName}/
         ├── {$entityName}.controller.ts
         ├── {$entityName}.services.ts
         ├── {$entityName}.routes.ts
         ├── {$entityName}.interfaces.ts
         └── {$entityName}.repository.ts
     ```
   - File names are defined by the entity name (kebab-case) and the fixed suffixes above.

## Migration

After creating the entity in the Prisma schema, create and run the migration:

```bash
npx prisma migrate dev --name create_{entity_name}
```

This command creates the migration file and applies it to the SQLite database. It must be executed for every new entity.
