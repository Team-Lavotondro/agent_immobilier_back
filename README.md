src/
├── accounts/                          # 📁 DOMAINE "COMPTES & SÉCURITÉ"
│   ├── admin/                         # └── Espace d'administration
│   │   ├── admin.controller.ts
│   │   ├── admin.module.ts
│   │   └── admin.service.ts
│   │
│   ├── auth/                          # └── Gestion des connexions et tokens
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   │
│   └── users/                         # └── Table unique de l'application
│       ├── dto/                       #     (Contient CreateUserDto)
│       ├── entities/                  #     (user.entity.ts avec le champ role)
│       ├── enums/                     #     (role.enum.ts : ADMIN, MANAGER, CLIENT)
│       ├── users.controller.ts        #     (Route commune /accounts/profile)
│       ├── users.module.ts
│       └── users.service.ts
│
├── common/                            # 📁 SYSTÈME LOGICIEL CENTRAL & PARTAGÉ
│   ├── decorators/
│   │   └── roles.decorator.ts         # Décorateur @Roles(...)
│   │
│   ├── guards/
│   │   ├── jwt-auth.guard.ts          # Décodage et vérification du token JWT
│   │   └── roles.guard.ts             # Blocage des routes selon le rôle de l'utilisateur
│   │
│   └── mailer/                        # Service d'envoi de mail global (@Global)
│       ├── mailer.module.ts
│       └── mailer.service.ts
│
├── favoris/                           # 📁 RESSOURCE MÉTIER : FAVORIS
│   ├── dto/                           # (CreateFavoriDto)
│   ├── entities/                      # (favori.entity.ts lié à un User et une Offre)
│   ├── favoris.controller.ts          # (Routes POST /favoris, DELETE /favoris/:id)
│   ├── favoris.module.ts
│   └── favoris.service.ts
│
├── offres/                            # 📁 RESSOURCE MÉTIER : OFFRES (Annonces/Produits)
│   ├── dto/                           # (CreateOffreDto, UpdateOffreDto)
│   ├── entities/                      # (offre.entity.ts représentant une offre en BDD)
│   ├── offres.controller.ts           # (Routes GET /offres, POST /offres, etc.)
│   ├── offres.module.ts
│   └── offres.service.ts
│
├── accounts.module.ts                 # Fichier qui regroupe admin + auth + users
├── app.module.ts                      # Fichier racine chargeant Mailer, Accounts, Offres et Favoris
└── main.ts                            # Point d'entrée pour démarrer l'application
