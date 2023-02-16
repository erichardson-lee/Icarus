import fastify from "npm:fastify";
import { Module } from "../../mod.ts";

const f = fastify({});

export const fastifyModule = new Module("fastify", f);
