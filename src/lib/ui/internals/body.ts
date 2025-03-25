/*
 * Lock the [data-ioui-main] overflow.
 */
export function lockOverflow() {
	const data = document.querySelector('[data-ioui-main]');

	if (data) {
		data.classList.add('overflow-hidden');
	}
}

/*
 * Same thing as lockOverflow but the opposite.
 * Unlock the [data-ioui-main] overflow.
 */
export function unlockOverflow() {
	const dataTag = document.querySelector('[data-ioui-main]');

	if (dataTag) {
		dataTag.classList.remove('overflow-hidden');
	}
}

/*
 * Scales the background to act as if it were a back-sheet.
 * Scales the [data-ioui-main] tag and the [data-ioui-body] tag.
 * Inspired by Vaul and the iOS drawer.
 */
export function scaleBackground(isOpen: boolean) {
	const drawerMain = document.querySelector('[data-ioui-main]');
	const drawerBody = document.querySelector('[data-ioui-body]');

	if (drawerMain) {
		if (!isOpen) {
			drawerMain.classList.remove(
				'absolute',
				'bottom-0',
				'w-[98.5vw]',
				'h-[98.5vh]',
				'rounded-lg-t-lg',
				'rounded-lg-b-none'
			);
		} else {
			drawerMain.classList.add(
				'absolute',
				'bottom-0',
				'w-[98.5vw]',
				'h-[98.5vh]',
				'rounded-lg-t-lg',
				'rounded-lg-b-none'
			);
		}
	}

	if (drawerBody) {
		if (isOpen) {
			drawerBody.classList.remove('items-center');
		} else {
			drawerBody.classList.add('items-center');
		}
	}

	// Add overflow-hidden class at the start
	if (isOpen) {
		document.body.classList.add('overflow-hidden');
	}
}
