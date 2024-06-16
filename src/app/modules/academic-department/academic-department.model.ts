import { Schema, model } from 'mongoose';
import TAcademicDepartment from './academic-department.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
    {
        name: { type: String, required: true, unique: true },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'AcademicFaculty',
        },
    },
    {
        timestamps: true,
    }
);

academicDepartmentSchema.pre('save', async function (next) {
    const isDepartmentExist = await AcademicDepartment.findOne({
        name: this.name,
    });
    if (isDepartmentExist) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Department already exists!'
        );
    }

    next();
});

academicDepartmentSchema.pre('updateOne', async function (next) {
    const query = this.getQuery();

    const isDepartmentExist = await AcademicDepartment.findOne(query);
    if (!isDepartmentExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Academic department does not exist!'
        );
    }

    next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
    'AcademicDepartment',
    academicDepartmentSchema
);
