import { useEffect } from "react";

const useDismissOnOutsideClick = (ref, triggerCondition, callbackFunction) => {
	const handleClickOutside = (event) => {
		if (triggerCondition && ref.current && !ref.current.contains(event.target)) {
			callbackFunction();
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	});
};

export default useDismissOnOutsideClick;
