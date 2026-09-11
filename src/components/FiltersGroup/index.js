import React from 'react'
import {ThreeDots} from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const FiltersGroup = props => {
  const {
    employmentTypesList,
    salaryRangesList,
    locationsList,
    changeEmploymentType,
    changeSalaryRange,
    changeLocation,
    activeEmploymentTypes,
    activeSalaryRange,
    activeLocations,
    profileDetails,
    profileApiStatus,
    getProfileDetails,
  } = props

  const renderProfileSuccessView = () => {
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  const renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="retry-button"
        onClick={() => getProfileDetails()}
      >
        Retry
      </button>
    </div>
  )

  const renderProfileLoadingView = () => (
    <div className="profile-loader-container" data-testid="loader">
      <ThreeDots color="#ffffff" height="50" width="50" />
    </div>
  )

  const renderProfileDetails = () => {
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return renderProfileSuccessView()
      case apiStatusConstants.failure:
        return renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return renderProfileLoadingView()
      default:
        return null
    }
  }

  const renderEmploymentTypesFilter = () => (
    <div className="filter-category-container">
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="filter-list">
        {employmentTypesList.map(type => {
          const isChecked = activeEmploymentTypes.includes(type.employmentTypeId)
          const onChangeCheckbox = () => {
            changeEmploymentType(type.employmentTypeId)
          }
          return (
            <li className="filter-item" key={type.employmentTypeId}>
              <input
                type="checkbox"
                id={type.employmentTypeId}
                className="checkbox-input"
                checked={isChecked}
                onChange={onChangeCheckbox}
              />
              <label htmlFor={type.employmentTypeId} className="filter-label">
                {type.label}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  const renderSalaryRangesFilter = () => (
    <div className="filter-category-container">
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="filter-list">
        {salaryRangesList.map(salary => {
          const isChecked = activeSalaryRange === salary.salaryRangeId
          const onChangeRadio = () => {
            changeSalaryRange(salary.salaryRangeId)
          }
          return (
            <li className="filter-item" key={salary.salaryRangeId}>
              <input
                type="radio"
                id={salary.salaryRangeId}
                className="radio-input"
                name="salary"
                checked={isChecked}
                onChange={onChangeRadio}
              />
              <label htmlFor={salary.salaryRangeId} className="filter-label">
                {salary.label}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  const renderLocationsFilter = () => (
    <div className="filter-category-container">
      <h1 className="filter-heading">Locations</h1>
      <ul className="filter-list">
        {locationsList.map(loc => {
          const isChecked = activeLocations.includes(loc.locationId)
          const onChangeLocationCheckbox = () => {
            changeLocation(loc.locationId)
          }
          return (
            <li className="filter-item" key={loc.locationId}>
              <input
                type="checkbox"
                id={loc.locationId}
                className="checkbox-input"
                checked={isChecked}
                onChange={onChangeLocationCheckbox}
              />
              <label htmlFor={loc.locationId} className="filter-label">
                {loc.label}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return (
    <div className="filters-group-container">
      {renderProfileDetails()}
      <hr className="separator-line" />
      {renderEmploymentTypesFilter()}
      <hr className="separator-line" />
      {renderSalaryRangesFilter()}
      <hr className="separator-line" />
      {renderLocationsFilter()}
    </div>
  )
}

export default FiltersGroup
