import {Component} from 'react'
import Cookie from 'js-cookie'
import {ThreeDots} from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationsList = [
  {
    locationId: 'HYDERABAD',
    label: 'Hyderabad',
  },
  {
    locationId: 'BANGALORE',
    label: 'Bangalore',
  },
  {
    locationId: 'CHENNAI',
    label: 'Chennai',
  },
  {
    locationId: 'DELHI',
    label: 'Delhi',
  },
  {
    locationId: 'MUMBAI',
    label: 'Mumbai',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
    activeEmploymentTypes: [],
    activeSalaryRange: '',
    activeLocations: [],
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookie.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const updatedProfileDetails = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileDetails: updatedProfileDetails,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {
      activeEmploymentTypes,
      activeSalaryRange,
      activeLocations,
      searchInput,
    } = this.state
    const jwtToken = Cookie.get('jwt_token')

    const employmentTypes = activeEmploymentTypes.join(',')
    const locations = activeLocations.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${activeSalaryRange}&search=${searchInput}&location=${locations}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobsList = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      // Apply client-side location filtering if activeLocations is non-empty
      let filteredJobsList = updatedJobsList
      if (activeLocations.length > 0) {
        const activeLocationLabels = activeLocations.map(locId => {
          const found = locationsList.find(l => l.locationId === locId)
          return found ? found.label.toLowerCase() : locId.toLowerCase()
        })
        filteredJobsList = updatedJobsList.filter(job =>
          activeLocationLabels.some(locLabel =>
            job.location.toLowerCase().includes(locLabel),
          ),
        )
      }

      this.setState({
        jobsList: filteredJobsList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeEmploymentType = typeId => {
    this.setState(prevState => {
      const {activeEmploymentTypes} = prevState
      const isAlreadyPresent = activeEmploymentTypes.includes(typeId)
      let updatedTypes = []
      if (isAlreadyPresent) {
        updatedTypes = activeEmploymentTypes.filter(id => id !== typeId)
      } else {
        updatedTypes = [...activeEmploymentTypes, typeId]
      }
      return {activeEmploymentTypes: updatedTypes}
    }, this.getJobs)
  }

  changeSalaryRange = salaryId => {
    this.setState({activeSalaryRange: salaryId}, this.getJobs)
  }

  changeLocation = locationId => {
    this.setState(prevState => {
      const {activeLocations} = prevState
      const isAlreadyPresent = activeLocations.includes(locationId)
      let updatedLocations = []
      if (isAlreadyPresent) {
        updatedLocations = activeLocations.filter(id => id !== locationId)
      } else {
        updatedLocations = [...activeLocations, locationId]
      }
      return {activeLocations: updatedLocations}
    }, this.getJobs)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onKeyDownSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  onClickSearchButton = () => {
    this.getJobs()
  }

  renderJobsSuccessView = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h1 className="no-jobs-heading">No Jobs Found</h1>
          <p className="no-jobs-description">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <JobCard key={job.id} jobDetails={job} />
        ))}
      </ul>
    )
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobs}
      >
        Retry
      </button>
    </div>
  )

  renderJobsLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <ThreeDots color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderJobsLoadingView()
      default:
        return null
    }
  }

  render() {
    const {
      activeEmploymentTypes,
      activeSalaryRange,
      activeLocations,
      searchInput,
      profileDetails,
      profileApiStatus,
    } = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-content">
            <div className="search-mobile-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onKeyDownSearchInput}
              />
              <button
                type="button"
                className="search-button"
                data-testid="searchButton"
                onClick={this.onClickSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              locationsList={locationsList}
              changeEmploymentType={this.changeEmploymentType}
              changeSalaryRange={this.changeSalaryRange}
              changeLocation={this.changeLocation}
              activeEmploymentTypes={activeEmploymentTypes}
              activeSalaryRange={activeSalaryRange}
              activeLocations={activeLocations}
              profileDetails={profileDetails}
              profileApiStatus={profileApiStatus}
              getProfileDetails={this.getProfileDetails}
            />
            <div className="jobs-section">
              <div className="search-desktop-container">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  value={searchInput}
                  onChange={this.onChangeSearchInput}
                  onKeyDown={this.onKeyDownSearchInput}
                />
                <button
                  type="button"
                  className="search-button"
                  data-testid="searchButton"
                  onClick={this.onClickSearchButton}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              {this.renderJobsView()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
