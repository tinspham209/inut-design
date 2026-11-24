# Safe API Fixtures

`fixtures.json` is the only source of truth for migration fixture inputs. It
covers every route under `pages/api/` and must be loaded through `fixture-loader.mjs`.

Every fixture declares `mockAdapters` and an `expectedSideEffects: 0` contract.
Runners must fail before sending a request when a write-capable adapter is not
mocked or no-oped. The fixtures intentionally avoid real customer contacts,
credentials, production identifiers, upload content, and production documents.

The Creativa raw-byte and image-validation boundaries are stored in their
dedicated `creativa/` and `uploads/` subdirectories. Do not move arbitrary
binary data or secrets into this registry.
