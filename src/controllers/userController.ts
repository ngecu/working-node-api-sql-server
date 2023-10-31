import { Request, Response } from "express"
import mssql from 'mssql'
import { sqlConfig } from "../config/sqlConfig"
import { regUserSchema } from "../validators/userValidators"
import { isEmpty } from "lodash"


export const registerUser = async(req: Request, res: Response) =>{
    try {
        const {FullName, email, phone_no,  profession, password} = req.body

        const {error} = regUserSchema.validate(req.body)

        if(error){
            return res.status(422).json(error)
        }

        const pool =  await mssql.connect(sqlConfig)

        const isEmailInUse = (await pool.query(`SELECT * FROM Users WHERE email = '${email}'`)).recordset

        const isPhoneNoTaken = (await pool.query(`SELECT * FROM Users WHERE phone_no ='${phone_no}'`)).recordset

        if(!isEmpty(isEmailInUse)){
            return res.json({message: 'Email already exists'})
        }
        if(!isEmpty(isPhoneNoTaken)){
            return res.json({message: 'Phone number already exists'})
        }

        let result = await pool.query(`INSERT INTO Users(FullName, email, phone_no, profession, password) Values('${FullName}', '${email}', '${phone_no}', '${profession}', '${password}')`)

        return res.status(200).json({
            message: 'Account created successfully'
        })
        

    } catch (error) {
        return res.status(501).json({error: error})
    }
}