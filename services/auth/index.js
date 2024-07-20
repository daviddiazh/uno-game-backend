import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import authSchema from '../../models/auth.js';
import { verifyJwt } from '../../middlewares/verify-jwt.js';

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
          token: this.jwtService.sign({ _id: user?._id + '' }, process.env.JWT_KEY, {expiresIn: '4h'}),
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

    async updateUserLogged( _id, newStatus ) {
        try {
            await this.db.findByIdAndUpdate(_id, {online: newStatus});
        } catch (error) {
            throw new Error('Error al actualizar la conexión del usuario');
        }
    }

    async findUsers( userIdFrom, nameUserTo ) {
        if (userIdFrom) {
            const resp = await this.db.aggregate([
                {
                    $lookup: {
                        from: "friendsrequests",
                        as: "sended",
                        let: {
                            userIdTo: '$_id',
                        },

                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{
                                            $eq: ["$userIdTo", "$$userIdTo"],
                                        }]
                                    },
                                    userIdFrom: new mongoose.Types.ObjectId(userIdFrom),
                                }
                            }
                        ],
                    },

                },
                {
                    $lookup: {
                        from: "friendsrequests",
                        as: "received",
                        let: {
                            userIdFrom: '$_id',
                        },

                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{
                                            $eq: ["$userIdFrom", "$$userIdFrom"],
                                        }]
                                    },
                                    userIdTo: new mongoose.Types.ObjectId(userIdFrom),
                                }
                            }
                        ],
                    },
                },

                {
                    $addFields: {
                      sended: { $gt: [{ $size: "$sended" }, 0] },
                      received: { $gt: [{ $size: "$received" }, 0] },
                    }
                }
            ]);
            return resp;
        }

        return [];
    }

    async validateToken( token= '' ) {
        const { _id } = await verifyJwt(token);
        
        if ( _id ) {
            const user = await this.db.findById(_id);
            return {
                ...user['_doc'],
                password: null,
            }
        }
    }
}
