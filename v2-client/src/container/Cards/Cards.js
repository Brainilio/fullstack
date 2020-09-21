import React, { useEffect, useState } from "react"
import ChampDetail from "../../components/ChampDetail/ChampDetail"
import axiosAPI from "../../axios"
import Spinner from "../../UI/Spinner/Spinner"
import Pagination from "../../UI/Pagination/Pagination"
import Banner from "../../components/Banner/Banner"
import Card from "../../components/Card/Card"
import AddChamp from "../../components/AddChamp/AddChamp"
import "./Cards.scss"
import Modal from "../../UI/Modal/Modal"
import * as actions from "../../store/actions/index"
import { connect } from "react-redux"

const Cards = (props) => {
	const [loader, setLoader] = useState(false)

	const [addChamp, setAddChamp] = useState(false)


	const [currentPage, setCurrentPage] = useState(1)
	const [cardsPerPage, setCardsPerPage] = useState(5)


	const [champId, setChampId] = useState(null)
	const [detailChamp, setDetailChamp] = useState(false)


	const [succesMessage, setSuccessMessage] = useState(false)
	const [cardLayout, setCardLayout] = useState(false)

	useEffect(() => {
		props.onFetchChamps()
	}, [])

	// --------------- PAGINATION 
	let indexOfLastChamp, indexOfFirstChamp, currentCards
	indexOfLastChamp = currentPage * cardsPerPage
	indexOfFirstChamp = indexOfLastChamp - cardsPerPage
	currentCards = props.champs.slice(indexOfFirstChamp, indexOfLastChamp)
	
	//change page
	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	//-----------------

	const toggleModal = (id) => {
		setDetailChamp((prevState) => !prevState)
		setChampId(id)
	}

	const closeFormForAdding = () => {
		setAddChamp((prevState) => !prevState)
	}

	const editChampion = (champData) => {
		axiosAPI
			.put(`/` + champData._id, {
				name: champData.name,
				type: champData.type,
				lane: champData.lane,
				cost: champData.cost,
			})
			.then(() => {
					props.onFetchChamps()
				setDetailChamp(false)
			})
	}


	const afterDeletion = () => { props.onFetchChamps(); setDetailChamp(false) }


	const addChampion = (championData, event) => {
		event.preventDefault()
		axiosAPI
			.post("/", championData)
			.then(() => setSuccessMessage((prev) => !prev))
			.then(() => setAddChamp(false))
			.then(() => 	props.onFetchChamps())
	}

	const layoutHandler = () => {
		setCardLayout((prevstate) => !prevstate)

	}

	const addChampModalHandler = () => setAddChamp((prevState) => !prevState)

	const cardSectionClasses = ["card-section"]
	if (cardLayout) {
		cardSectionClasses.push("long-card-section")
	}

	const cardsDisplay = []
	if (currentCards) {
		currentCards.map((champion) => {
			return cardsDisplay.push(
				<Card
					key={champion._id}
					layout={cardLayout}
					clicked={toggleModal}
					champion={champion}
				/>
			)
		})
	}
	return (
		<>
			<Banner cardLayout={layoutHandler} addChampion={addChampModalHandler} />

			{addChamp ? (
				<Modal clicked={closeFormForAdding}>
					<AddChamp clicked={addChampion} />
				</Modal>
			) : null}


			{detailChamp ? (
				<Modal clicked={toggleModal}>
					<ChampDetail
						id={champId}
						editThisChamp={editChampion}
						afterDeletion={afterDeletion}
					/>
				</Modal>
			) : null}

			<h1
				style={{
					textAlign: "center",
					marginTop: "25px",
				}}
				className="title-card-page"
			>
				My League of Legends Champions:
			</h1>


			
			{/* {succesMessage ? (
				<h1
					style={{ color: "green", textAlign: "center" }}
					onClick={() => setSuccessMessage((prev) => !prev)}
				>
					Succesfully added your champion!
				</h1>
			) : null} */}

			{/* Spinner */}
			{props.loading ? <Spinner /> : null}

			{/* Card-page */}
			<section className="card-page">
				<div className={cardSectionClasses.join(" ")}>
					{cardLayout ? (
						<>{cardsDisplay.map((card) => card)}</>
					) : (
					<> {cardsDisplay.map((card) => card)} </>
					)}
				</div>
				
					
			
			</section>
		

			<Pagination
						cardsPerPage={cardsPerPage}
						paginate={paginate}
						totalCards={props.champs.length}
					/>
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		champs: state.champs.champs,
		loading: state.champs.loading

	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onFetchChamps: () => 
			dispatch(actions.fetchChamps())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards)
