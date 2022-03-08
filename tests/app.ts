import express from "express";
import passport from "passport";
import indexRouter from "../src/routes/indexRouter";
import jwtStrategy from "../src/strategies/jwtStrategy";
const app = express();
passport.use(jwtStrategy);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use("/", indexRouter);
export default app;
