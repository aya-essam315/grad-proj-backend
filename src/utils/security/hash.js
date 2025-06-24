import bcrypt from "bcrypt";

export const hashData = ({data, saltRounds = 8}) => {
    const hashedData = bcrypt.hashSync(data, saltRounds)
    return hashedData;
}


export const compareValues = ({data, hashedData}) => {
    const isMatch = bcrypt.compareSync(data, hashedData)
    return isMatch;
}