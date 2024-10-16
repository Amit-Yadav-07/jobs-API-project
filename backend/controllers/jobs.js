const Job = require('../models/jobs');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {

    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    return res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
}

const getJob = async (req, res) => {

    const { user: { userId }, params: { id: jobId } } = req;

    const job = await Job.findOne({
        _id: jobId, createdBy: userId
    })

    if (!job) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: `no job with id ${jobId}` });
    }
    return res.status(StatusCodes.OK).json({ msg: job });





    // return res.send('Get Jobs');

}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body)

    return res.status(StatusCodes.CREATED).json({ job });

}

// update job
const updateJob = async (req, res) => {

    console.log(req.body);
    const { body: { company, position }, user: { userId }, params: { id: jobId } } = req;

    if (!company || !position) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "company or position can't be empty" })
    }

    const job = Job.findByIdAndDelete({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true })

    if (!job) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: `no job with id ${jobId}` });
    }

    return res.status(StatusCodes.OK).json({ msg: job });
}

const deleteJob = async (req, res) => {
    return res.send('Delete Jobs');
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}