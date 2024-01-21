import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";

import {createContactSchema, updateContactSchema} from "./schemas/contactsSchemas.js"
import validateBody from './helpers/validateBody.js';
import { createContact, updateContact } from './controllers/contactsControllers.js';

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack); 
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});


app.post('/api/contacts', validateBody(createContactSchema), createContact);
app.put('/api/contacts/:id', validateBody(updateContactSchema), updateContact);

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});