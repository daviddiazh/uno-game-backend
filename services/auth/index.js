import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authSchema from '../../models/auth.js';

export class AuthService {
    constructor() {
        this.hashService = bcrypt;
        this.jwtService = jwt;
        this.db = authSchema;
    }
  
    async login(payload) {
      try {
        const { email, password: passwordReq } = payload;
  
        const user = await this.db.findOne({ email: email.toLowerCase() });
  
        if (!user) {
            return {
                code: 401,
                message: 'Error al iniciar sesión',
            };
        }
  
        const isMatchPasswords = await this.hashService.compare(
          passwordReq,
          user?.password,
        );
  
        if (!isMatchPasswords) {
            return {
                code: 401,
                message: 'Error al iniciar sesión',
            };
        }
  
        return {
          user: {
            ...user['_doc'],
            password: null,
          },
          token: this.jwtService.sign({ _id: user?._id + '' }, process.env.JWT_KEY),
        };
      } catch (error) {
        throw error;
      }
    }

    async enrollment(payload) {
        try {
            const user = await this.db.findOne({
                email: payload.email.toLowerCase(),
            });
        
            if (user) return {
                code: 400,
                message: 'Error al crear el usuario',
            };
        
            const passwordEncrypted = await this.hashService.hash(payload.password, 10);
        
            await this.db.create({
                ...payload,
                email: payload.email.toLowerCase(),
                password: passwordEncrypted,
            });
        
            return {
                enrolled: true,
            };
        } catch (error) {
            throw error;
        }
    }

    async updateUserLogged( uid, newStatus ) {
        try {
            await this.db.findByIdAndUpdate(uid, {online: newStatus});
        } catch (error) {
            throw new Error('Error al actualizar la conexión del usuario');
        }
    }

    async findUsers( name ) {
        if (name) {
            return await this.db.find({name});
        }

        return await this.db.find();
    }
}
