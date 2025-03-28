import React, { useState, useEffect, useRef } from "react";
import {
	Box,
	Typography,
	CircularProgress,
	Chip,
	InputBase,
	Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { fetchArticles, subscribeNewsletter } from "../services/api";
import {
	EXPLOSIVE_YELLOW_COLOR,
	LIGHT_MEDIUM_BLUE_COLOR,
	LINE_COLOR,
	MEDIUM_DARK_DARK_GREY_COLOR,
	MEDIUM_DARK_GREY_COLOR,
	MEDIUM_GREY_COLOR,
	PRIMARY_COLOR,
	SEARCH_BAR_COLOR,
	WHITE_COLOR,
} from "../constants/constant";
import logo from "../assets/logo_v2.png";
import languageIcon from "../assets/language_v2.svg";
import bookmarkIcon from "../assets/save.svg";
import shareIcon from "../assets/share.svg";
import volumeIcon from "../assets/sound.svg";
import linkIcon from "../assets/link.svg";
import bellIcon from "../assets/bell_icon.svg";
import { Book, MenuBookRounded, SearchOff } from "@mui/icons-material";
import textToSpeech from "../util/text-to-speech";
import searchIcon from "../assets/search.svg";

// Placeholder image for articles without images
const DEFAULT_IMAGE =
	"https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80";

const ArticleView = () => {
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeStep, setActiveStep] = useState(0);
	const [swipeProgress, setSwipeProgress] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [isSubscribing, setIsSubscribing] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const [searchText, setSearchText] = useState("");
	const searchRef = useRef(null);
	const location = useLocation();
	const navigate = useNavigate();

	const toggleBottomSheet = () => {
		setIsBottomSheetOpen(!isBottomSheetOpen);
	};

	useEffect(() => {
		textToSpeech.init();

		// Clean up when component unmounts
		return () => {
			textToSpeech.stop();
		};
	}, []);

	useEffect(() => {
		const loadArticles = async () => {
			try {
				setLoading(true);
				setError(null);

				// Get all query parameters
				const params = {
					q: new URLSearchParams(location.search).get("q"),
					industry: new URLSearchParams(location.search).get("industry"),
					keyword: new URLSearchParams(location.search).get("keyword"),
					india_focus: new URLSearchParams(location.search).get("india_focus"),
					business_only: new URLSearchParams(location.search).get(
						"business_only",
					),
				};

				const data = await fetchArticles(params);

				if (data && data.articles) {
					setArticles(data.articles);
				} else {
					setError("No articles found");
				}
			} catch (err) {
				console.error("Error loading articles:", err);
				setError(err.message || "Failed to load articles");
			} finally {
				setLoading(false);
			}
		};

		loadArticles();
	}, [location]);

	const handlers = useSwipeable({
		onSwiping: (event) => {
			// Only allow swipe up or swipe down if not on first article
			if (
				(event.dir === "Up" && activeStep < articles.length - 1) ||
				(event.dir === "Down" && activeStep > 0)
			) {
				// Calculate swipe progress (0 to 1)
				const progress = Math.min(Math.abs(event.deltaY) / 200, 1);
				setSwipeProgress(event.dir === "Up" ? progress : -progress);
			}
		},
		onSwipedUp: () => {
			if (activeStep < articles.length - 1 && swipeProgress > 0.5) {
				setIsAnimating(true);
				setSwipeProgress(1);
				setTimeout(() => {
					setActiveStep((prev) => prev + 1);
					setSwipeProgress(0);
					setIsAnimating(false);
				}, 300);
			} else {
				setSwipeProgress(0);
			}
		},
		onSwipedDown: () => {
			if (activeStep > 0 && swipeProgress < -0.5) {
				setIsAnimating(true);
				setSwipeProgress(-1);
				setTimeout(() => {
					setActiveStep((prev) => prev - 1);
					setSwipeProgress(0);
					setIsAnimating(false);
				}, 300);
			} else {
				setSwipeProgress(0);
			}
		},
		onTouchEndOrOnMouseUp: () => {
			if (Math.abs(swipeProgress) <= 0.5) {
				setSwipeProgress(0);
			}
		},
		preventDefaultTouchmoveEvent: true,
		trackMouse: true,
		delta: 10,
	});

	const handleSubscribe = async () => {
		if (!phoneNumber || phoneNumber.length < 10) {
			alert("Please enter a valid phone number");
			return;
		}

		try {
			setIsSubscribing(true);
			const data = await subscribeNewsletter({
				mobile_number: phoneNumber,
				is_subscribed: true,
			});
			console.log(data);
			setPhoneNumber("");
			setIsBottomSheetOpen(false);
			setIsSubscribed(true);
			setShowSuccessModal(true);

			// Auto-hide success modal after 3 seconds
			setTimeout(() => {
				setShowSuccessModal(false);
			}, 3000);
		} catch (error) {
			console.error("Error subscribing to newsletter:", error);
		} finally {
			setIsSubscribing(false);
		}
	};

	const handleSearch = () => {
		if (searchText.trim()) {
			navigate(`/article-view?q=${encodeURIComponent(searchText.trim())}`);
			setSearchText("");
			setSearchFocused(false);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setSearchFocused(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Render the Header with logo and language/subscription controls
	const renderHeader = () => (
		<Box
			sx={{
				maxWidth: "500px",
				display: "flex",
				flexDirection: "column",
				position: "fixed",
				zIndex: 1000,
				width: "100%",
				top: 0,
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
						bgcolor: PRIMARY_COLOR,
						padding: "12px 24px",
					}}
				>
					<img
						src={logo}
						alt="Buzzar Brief Logo"
						style={{ width: "103px", cursor: "pointer" }}
						onClick={() => navigate("/customize-feed")}
					/>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						{!isSubscribed && (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									backgroundColor: EXPLOSIVE_YELLOW_COLOR,
									borderRadius: "48px",
									padding: "5px",
									paddingRight: "16px",
									marginRight: "5px",
									height: "44px",
									cursor: "pointer",
								}}
								onClick={toggleBottomSheet}
							>
								<Box
									sx={{
										borderRadius: "50%",
										backgroundColor: PRIMARY_COLOR,
										width: "34px",
										height: "34px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<img
										src={bellIcon}
										alt="bookmark"
										style={{ width: "20px", height: "20px" }}
									/>
								</Box>
								<Typography
									variant="caption"
									sx={{
										color: PRIMARY_COLOR,
										fontSize: "14px",
										fontFamily: "Inter",
										fontWeight: 500,
									}}
								>
									Subscribe
								</Typography>
							</Box>
						)}
						<img
							src={languageIcon}
							alt="Language"
							style={{ height: "22px", width: "22px", objectFit: "contain" }}
						/>
					</Box>
				</Box>

				{/* Search Bar */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: "100%",
						backgroundColor: WHITE_COLOR,
						padding: "12px 24px",
					}}
				>
					<Box
						ref={searchRef}
						sx={{
							display: "flex",
							alignItems: "center",
							backgroundColor: SEARCH_BAR_COLOR,
							borderRadius: "100px",
							fontFamily: "Inter",
							fontSize: "14px",
							height: "46px",
							fontWeight: "400",
              width: '100%',
							paddingRight: searchFocused ? "4px" : "12px",
							transition: "all 0.3s ease",
							paddingLeft: "15px",
						}}
					>
						<img
							src={searchIcon}
							alt="search"
							style={{ width: "20px", height: "20px", objectFit: "contain" }}
						/>
						<InputBase
							placeholder="Search for news..."
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							onFocus={() => setSearchFocused(true)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSearch();
								}
							}}
							sx={{
								flex: 1,
								fontFamily: "Inter",
								paddingLeft: "12px",
								fontSize: "14px",
								color: MEDIUM_DARK_DARK_GREY_COLOR,
								"& input::placeholder": {
									opacity: 1,
								},
							}}
						/>
						{searchFocused && (
							<Button
								variant="contained"
								onClick={handleSearch}
								sx={{
									minWidth: "unset",
									height: "36px",
									width: "36px",
									borderRadius: "50%",
									p: 0,
									backgroundColor: PRIMARY_COLOR,
									color: WHITE_COLOR,
									"&:hover": {
										backgroundColor: PRIMARY_COLOR,
										opacity: 0.9,
									},
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="5" y1="12" x2="19" y2="12"></line>
									<polyline points="12 5 19 12 12 19"></polyline>
								</svg>
							</Button>
						)}
					</Box>
				</Box>
			</Box>
		</Box>
	);

	// New NotFoundComponent
	const NotFoundComponent = () => (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: "24px",
				height: "calc(100vh - 95px)", // Adjust for header height
				textAlign: "center",
			}}
		>
			<SearchOff sx={{ fontSize: 80, color: MEDIUM_GREY_COLOR, mb: 3 }} />
			<Typography
				variant="h5"
				sx={{
					fontFamily: "Times",
					fontWeight: 600,
					color: MEDIUM_DARK_DARK_GREY_COLOR,
					mb: 2,
				}}
			>
				No Articles Found
			</Typography>
			<Typography
				sx={{
					fontFamily: "Inter",
					fontWeight: 400,
					fontSize: "14px",
					color: MEDIUM_DARK_GREY_COLOR,
					mb: 4,
				}}
			>
				We couldn't find any articles matching your search criteria. Please try
				adjusting your filters.
			</Typography>
			<Button
				variant="contained"
				onClick={() => navigate("/customize-feed")}
				sx={{
					backgroundColor: PRIMARY_COLOR,
					borderRadius: "48px",
					padding: "10px 24px",
					textTransform: "none",
					fontFamily: "Inter",
					fontWeight: 500,
					"&:hover": {
						backgroundColor: PRIMARY_COLOR,
						opacity: 0.9,
					},
				}}
			>
				Back to Feed Customization
			</Button>
		</Box>
	);

	if (loading) {
		return (
			<Box
				sx={{
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					bgcolor: "white",
					width: "100%",
				}}
			>
				<Box
					sx={{
						width: "90%",
						height: "170px",
						borderRadius: "12px",
						animation: "shimmer 1.5s infinite linear",
						background:
							"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
						backgroundSize: "1000px 100%",
					}}
				/>
				<Box sx={{ width: "90%", mt: 3 }}>
					<Box
						sx={{
							width: "100%",
							height: "24px",
							borderRadius: "4px",
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 1,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 3,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 3,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 3,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 3,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 3,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 1,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 1,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 1,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 1,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 1,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 1,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							height: "16px",
							borderRadius: "4px",
							mt: 1,
							animation: "shimmer 1.5s infinite linear",
							background:
								"linear-gradient(to right, #f0f0f0 4%, #e0e0e0 25%, #f0f0f0 36%)",
							backgroundSize: "1000px 100%",
						}}
					/>
				</Box>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				height: "100vh",
				position: "relative",
				maxWidth: "500px",
				display: "flex",
				flexDirection: "column",
				bgcolor: "white",
			}}
		>
			{/* Header - always show regardless of articles status */}
			{renderHeader()}

			{/* Conditional rendering based on articles availability */}
			{articles.length === 0 ? (
				// Show the Not Found component when no articles
				<Box sx={{ marginTop: "95px" }}>
					<NotFoundComponent />
				</Box>
			) : (
				<>
					{renderHeader()}
					<Box
						sx={{
							position: "absolute",
							top: 140,
							left: 0,
							right: 0,
							bottom: 0,
							overflow: "hidden",
						}}
					>
						{/* All articles stacked on top of each other with proper z-index */}

						{/* Previous Article - comes from top when swiping down */}
						{articles[activeStep - 1] && (
							<ArticleCard
								key={articles[activeStep - 1].id}
								article={articles[activeStep - 1]}
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: "100%",
									// Start at -100% (above viewport) and move down when swiping down
									transform: `translateY(${
										swipeProgress < 0
											? -100 + Math.abs(swipeProgress) * 100
											: -100
									}%)`,
									// Fade in when swiping down
									opacity: swipeProgress < 0 ? Math.abs(swipeProgress) : 0,
									transition: isAnimating
										? "transform 0.3s ease-out, opacity 0.3s ease-out"
										: "none",
									zIndex: 3,
								}}
							/>
						)}

						{/* Current Article */}
						{articles[activeStep] && (
							<ArticleCard
								key={articles[activeStep].id}
								article={articles[activeStep]}
								handlers={handlers}
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: "100%",
									// When swiping up: move up; when swiping down: stay in place
									transform: `translateY(${
										swipeProgress > 0 ? -swipeProgress * 50 : 0
									}%)`,
									// Fade out in both directions
									opacity: 1 - Math.abs(swipeProgress),
									transition: isAnimating
										? "transform 0.3s ease-out, opacity 0.3s ease-out"
										: "none",
									zIndex: 2,
								}}
							/>
						)}

						{/* Next Article - starts below and fades in when swiping up */}
						{articles[activeStep + 1] && (
							<ArticleCard
								key={articles[activeStep + 1].id}
								article={articles[activeStep + 1]}
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: "100%",
									// Always positioned underneath, move up slightly when being revealed
									transform: `translateY(${
										swipeProgress > 0 ? 50 - swipeProgress * 50 : 50
									}%)`,
									// Fade in when swiping up
									opacity: swipeProgress > 0 ? swipeProgress : 0,
									transition: isAnimating
										? "transform 0.3s ease-out, opacity 0.3s ease-out"
										: "none",
									zIndex: 1,
								}}
							/>
						)}
					</Box>
				</>
			)}

			{/* Success Modal */}
			{showSuccessModal && (
				<Box
					sx={{
						position: "fixed",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						zIndex: 2000,
						backgroundColor: "white",
						borderRadius: "12px",
						boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
						maxWidth: "300px",
						width: "80%",
						textAlign: "center",
						padding: "50px",
					}}
				>
					<Box
						sx={{
							width: "64px",
							height: "64px",
							borderRadius: "50%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "0 auto 16px",
							border: `1px solid ${PRIMARY_COLOR}`,
						}}
					>
						<Box
							sx={{
								width: "60px",
								height: "60px",
								borderRadius: "50%",
								backgroundColor: PRIMARY_COLOR,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
									fill="white"
								/>
							</svg>
						</Box>
					</Box>
					<Typography
						sx={{
							fontFamily: "Times",
							fontWeight: 600,
							fontSize: "24px",
							marginBottom: "8px",
						}}
					>
						Subscribed!
					</Typography>
					<Typography
						sx={{ fontFamily: "Inter", fontWeight: 400, fontSize: "14px" }}
					>
						You have successfully subscribed to our newsletter
					</Typography>
				</Box>
			)}

			{/* Backdrop for success modal */}
			{showSuccessModal && (
				<Box
					onClick={() => setShowSuccessModal(false)}
					sx={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						zIndex: 1999,
					}}
				/>
			)}

			{/* Bottom Sheet Component */}
			<BottomSheet
				open={isBottomSheetOpen}
				onClose={() => setIsBottomSheetOpen(false)}
			>
				<Box
					sx={{
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Box
						sx={{
							width: "100%",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							marginTop: "34px",
						}}
					>
						<Box
							sx={{
								width: "100%",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: "34px",
							}}
						>
							<Box
								sx={{
									borderRadius: "50%",
									width: "62px",
									height: "62px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									border: `0.5px solid ${PRIMARY_COLOR}`,
								}}
							>
								<Box
									sx={{
										backgroundColor: PRIMARY_COLOR,
										borderRadius: "50%",
										width: "56px",
										height: "56px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<img
										src={bellIcon}
										alt="bookmark"
										style={{ width: "28px", height: "28px" }}
									/>
								</Box>
							</Box>
							<Typography
								sx={{
									fontFamily: "Times",
									fontWeight: 600,
									fontSize: "24px",
									marginTop: "16px",
								}}
							>
								Subscribe to Newsletter
							</Typography>
							<Typography
								sx={{
									fontFamily: "Inter",
									fontWeight: 400,
									fontSize: "12px",
									marginTop: "16px",
									maxWidth: "280px",
									textAlign: "center",
								}}
							>
								Please enter Whatsapp Mobile number to get latest Business News
							</Typography>
						</Box>
					</Box>
					<Box
						sx={{
							display: "block",
							maxWidth: "321px",
							flexDirection: "column",
							width: "100%",
							height: "1px",
							backgroundColor: LINE_COLOR,
							padding: "0px",
						}}
					/>
					<Box
						sx={{
							width: "100%",
							maxWidth: "321px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Typography
							sx={{
								fontFamily: "Inter",
								width: "100%",
								marginLeft: "-40px",
								fontWeight: 400,
								fontSize: "12px",
								marginTop: "31px",
								marginBottom: "16px",
								maxWidth: "280px",
								textAlign: "left",
							}}
						>
							Mobile Number
						</Typography>
						<Box
							sx={{
								width: "100%",
								border: `1px solid ${LIGHT_MEDIUM_BLUE_COLOR}`,
								borderRadius: "12px",
								padding: "4px 16px",
								marginBottom: "32px",
								backgroundColor: LINE_COLOR,
							}}
						>
							<InputBase
								fullWidth
								placeholder="Enter your WhatsApp number"
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
								type="tel"
								inputProps={{
									maxLength: 15,
									pattern: "[0-9]*",
								}}
								style={{
									fontFamily: "Inter",
									fontSize: "14px",
									color: MEDIUM_DARK_GREY_COLOR,
									height: "48px",
									backgroundColor: LINE_COLOR,
									borderRadius: "12px",
								}}
							/>
						</Box>

						<Box
							onClick={!isSubscribing ? handleSubscribe : undefined}
							sx={{
								width: "100%",
								backgroundColor: PRIMARY_COLOR,
								borderRadius: "48px",
								padding: "14px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								cursor: isSubscribing ? "default" : "pointer",
								opacity: isSubscribing ? 0.8 : 1,
								transition: "opacity 0.2s ease",
							}}
						>
							{isSubscribing ? (
								<CircularProgress size={24} sx={{ color: "white" }} />
							) : (
								<Typography
									sx={{
										color: "white",
										fontFamily: "Inter",
										fontWeight: 500,
										fontSize: "16px",
									}}
								>
									Subscribe Now
								</Typography>
							)}
						</Box>
					</Box>
				</Box>
			</BottomSheet>
		</Box>
	);
};

const ArticleCard = ({ article, handlers = {}, sx = {} }) => {
	const [isSpeaking, setIsSpeaking] = useState(false);

	const handleVoicePress = () => {
		if (isSpeaking) {
			textToSpeech.stop();
			setIsSpeaking(false);
		} else {
			// Prepare the text to be read
			// We'll combine the title and summary/content for a better experience
			const textToRead = `${article.title}. ${
				article.summary || article.content.slice(0, 1000)
			}`;

			textToSpeech.speak(
				textToRead,
				() => setIsSpeaking(true),
				() => setIsSpeaking(false),
			);
		}
	};

	return (
		<Box
			{...handlers}
			sx={{
				height: "100%",
				overflow: "auto",
				bgcolor: "white",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				...sx,
			}}
		>
			{/* Article Image */}
			<Box
				sx={{
					width: "100%",
					height: "170px",
					top: "25px",
					padding: "0px 24px",
					borderRadius: "12px",
				}}
			>
				<img
					src={article.image_url || DEFAULT_IMAGE}
					alt={article.title}
					onError={(e) => {
						e.target.onerror = null; // Prevent infinite loop
						e.target.src = DEFAULT_IMAGE;
					}}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						borderRadius: "12px",
					}}
				/>
			</Box>

			{/* Article Content */}
			<Box sx={{ padding: "24px" }}>
				<Typography
					sx={{
						color: MEDIUM_DARK_DARK_GREY_COLOR,
						fontSize: "24px",
						lineHeight: "32px",
						fontFamily: "Times",
						fontWeight: "700",
					}}
				>
					{article.title}
				</Typography>

				<Box sx={{ marginTop: "8px", display: "flex", alignItems: "center" }}>
					<Typography
						variant="caption"
						sx={{
							color: MEDIUM_GREY_COLOR,
							display: "flex",
							alignItems: "center",
							marginRight: "3px",
						}}
					>
						<MenuBookRounded
							sx={{
								color: MEDIUM_GREY_COLOR,
								width: "12px",
								height: "12px",
								textAlign: "center",
								marginBottom: "2px",
								marginRight: "4px",
							}}
						/>
						{Math.ceil(article.content.length / 1000)} mins read
					</Typography>
					<Typography variant="caption" sx={{ color: MEDIUM_GREY_COLOR }}>
						•{" "}
						{(() => {
							const publishDate = new Date(article.published_date);
							const now = new Date();
							const diffTime = Math.abs(now - publishDate);
							const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

							if (diffDays === 0) {
								return `Today ${publishDate.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}`;
							} else if (diffDays === 1) {
								return `Yesterday ${publishDate.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}`;
							} else {
								return `${diffDays} days ago`;
							}
						})()}
					</Typography>
				</Box>

				<Typography
					variant="body1"
					sx={{
						color: MEDIUM_DARK_GREY_COLOR,
						marginTop: "24px",
						fontSize: "14px",
						fontFamily: "Inter",
						fontWeight: 400,
					}}
				>
					{article.summary || article.content.slice(0, 300) + "..."}
				</Typography>

				{/* Action Buttons */}
				<Box
					sx={{
						position: "absolute",
						left: 0,
						right: 0,
						bottom: 0,
						display: "flex",
						padding: "20px 26px",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					{/* Read More Link */}
					<Box
						sx={{
							padding: "8px 16px",
							borderRadius: "30px",
							border: `1px solid ${PRIMARY_COLOR}`,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							width: "125px",
						}}
						onClick={() => window.open(article.url, "_blank")}
					>
						<Typography
							sx={{
								color: PRIMARY_COLOR,
								fontWeight: 400,
								fontSize: "14px",
								fontFamily: "Inter",
								cursor: "pointer",
							}}
						>
							Read More
						</Typography>
						<img
							src={linkIcon}
							alt="arrow right"
							style={{ width: "12px", height: "12px" }}
						/>
					</Box>

					<Box sx={{ display: "flex", gap: 1 }}>
						<Box
							sx={{
								borderRadius: "50%",
								boxShadow: "0px 0px 8px 3px rgba(0, 0, 0, 0.1)",
								backgroundColor: PRIMARY_COLOR,
								width: "46px",
								height: "46px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<img
								src={bookmarkIcon}
								alt="bookmark"
								style={{ width: "20px", height: "20px" }}
							/>
						</Box>
						<Box
							sx={{
								borderRadius: "50%",
								boxShadow: "0px 0px 8px 3px rgba(0, 0, 0, 0.1)",
								backgroundColor: PRIMARY_COLOR,
								width: "46px",
								height: "46px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<img
								src={shareIcon}
								alt="share"
								style={{ width: "20px", height: "20px" }}
							/>
						</Box>
						{/* Updated volume button with active state */}
						<Box
							onClick={handleVoicePress}
							sx={{
								borderRadius: "50%",
								boxShadow: "0px 0px 8px 3px rgba(0, 0, 0, 0.1)",
								backgroundColor: isSpeaking
									? EXPLOSIVE_YELLOW_COLOR
									: PRIMARY_COLOR,
								width: "46px",
								height: "46px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "pointer",
								transition: "background-color 0.3s ease",
							}}
						>
							<img
								src={volumeIcon}
								alt={isSpeaking ? "stop audio" : "play audio"}
								style={{
									width: "20px",
									height: "20px",
									filter: isSpeaking ? "invert(0%)" : "invert(0%)", // Adjust if needed for color
								}}
							/>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

// Bottom Sheet Component
const BottomSheet = ({ open, onClose, children }) => {
	return (
		<>
			{/* Transparent backdrop - always rendered but with opacity transition */}
			<Box
				onClick={onClose}
				sx={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(0, 0, 0, 0.5)",
					zIndex: 1200,
					opacity: open ? 1 : 0,
					visibility: open ? "visible" : "hidden",
					transition: "opacity 0.3s ease, visibility 0.3s ease",
					pointerEvents: open ? "auto" : "none",
				}}
			/>
			{/* Bottom sheet content - always rendered with transform transition */}
			<Box
				sx={{
					position: "fixed",
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "white",
					borderTopLeftRadius: "16px",
					borderTopRightRadius: "16px",
					padding: "24px",
					paddingTop: "16px",
					zIndex: 1300,
					transform: open ? "translateY(0)" : "translateY(100%)",
					transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					maxWidth: "500px",
					margin: "0 auto",
					boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.1)",
				}}
			>
				{children}
			</Box>
		</>
	);
};

export default ArticleView;
