import type { ICard } from "@models/card";
import { openDB } from "idb";

const DB_NAME = "lcstorage";
const DB_VERSION = 1;
const STORE_NAME = "cards";

const db = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    }
  },
});

export async function addCard(card: {
  name: string;
  code: string;
  format: string;
}) {
  const dbInstance = await db;
  return dbInstance.add(STORE_NAME, card);
}

export async function getCards(): Promise<ICard[]> {
  const dbInstance = await db;
  return dbInstance.getAll(STORE_NAME);
}

export async function getCard(id: number): Promise<ICard | undefined> {
  const dbInstance = await db;
  return dbInstance.get(STORE_NAME, id);
}

export async function deleteCard(id: number): Promise<void> {
  const dbInstance = await db;
  return dbInstance.delete(STORE_NAME, id);
}

export default {
  addCard,
  getCards,
  getCard,
  deleteCard,
};
