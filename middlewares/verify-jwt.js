import jwt from 'jsonwebtoken';

export const verifyJwt = ( token = '' ) => {

    try {
        const { uid } = jwt.verify( token, process.env.JWT_KEY );

        return { valid: true, uid };

    } catch (error) {
        return { valid: false, uid: null };
    }

}
