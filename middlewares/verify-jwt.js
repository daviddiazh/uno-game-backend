import jwt from 'jsonwebtoken';

export const verifyJwt = async ( token = '' ) => {

    try {
        const { _id } = await jwt.verify( token, process.env.JWT_KEY );

        return { valid: true, _id };
    } catch (error) {
        return { valid: false, _id: null };
    }

}
