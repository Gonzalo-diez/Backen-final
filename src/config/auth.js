import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "jsonwebtoken";
import User from "../dao/models/user.model.js";
import config from "./config.js";
import bcrypt from "bcrypt";

const initializePassport = () => {
    // Configurar estrategia de autenticación local
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'Credenciales incorrectas' });
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return done(null, false, { message: 'Credenciales incorrectas' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: "Iv1.05e58653a492fca1",//id de la app en github
                clientSecret: "84ca8f4841b9954c1fb97c4bd334fe8bfafb5528",//clave secreta de github
                callbackURL: "http://localhost:8080/users/githubcallback",//url callback de github
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile);//obtenemos el objeto del perfil
                    //buscamos en la db el email
                    const user = await User.findOne({
                        email: profile._json.email,
                    });
                    //si no existe lo creamos
                    if (!user) {
                        //contruimos el objeto según el modelo (los datos no pertenecientes al modelo lo seteamos por default)
                        const newUser = {
                            first_name: profile._json.name,
                            last_name: "",
                            age: 20,
                            email: profile._json.email,
                            password: "",
                        };
                        //guardamos el usuario en la database
                        let createdUser = await User.create(newUser);
                        done(null, createdUser);
                    } else {
                        done(null, user);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Serializar y deserializar usuario para guardar en sesión
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '1h' });
    return token;
};

const auth = {
    initializePassport,
    generateAuthToken
};

export default auth;