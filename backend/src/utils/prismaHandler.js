"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
// Re use single Prisma instance
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
var prisma = new client_1.PrismaClient();
exports.default = prisma;
