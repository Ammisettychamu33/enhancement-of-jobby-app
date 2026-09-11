import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li className="similar-job-item">
      <div className="similar-job-header">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-company-logo"
        />
        <div className="similar-title-rating-container">
          <h1 className="similar-title">{title}</h1>
          <div className="similar-rating-container">
            <AiFillStar className="star-icon" />
            <p className="similar-rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="similar-description-heading">Description</h1>
      <p className="similar-job-description">{jobDescription}</p>
      <div className="similar-location-type-container">
        <div className="similar-location-container">
          <MdLocationOn className="location-icon" />
          <p className="similar-location">{location}</p>
        </div>
        <div className="similar-employment-type-container">
          <BsBriefcaseFill className="briefcase-icon" />
          <p className="similar-employment-type">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
