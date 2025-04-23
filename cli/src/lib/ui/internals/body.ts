export function lockOverflow() {
  const data = document.querySelector("[data-ioui-main]");

  if (data) {
    data.classList.add("overflow-hidden");
  }
}

export function unlockOverflow() {
  const dataTag = document.querySelector("[data-ioui-main]");

  if (dataTag) {
    dataTag.classList.remove("overflow-hidden");
  }
}

export function scaleBackground(isOpen: boolean) {
  const drawerMain = document.querySelector("[data-ioui-main]");
  const drawerBody = document.querySelector("[data-ioui-body]");

  if (drawerMain) {
    if (!isOpen) {
      drawerMain.classList.remove(
        "absolute",
        "bottom-0",
        "w-[98.5vw]",
        "h-[98.5vh]",
        "rounded-lg-t-lg",
        "rounded-lg-b-none"
      );
    } else {
      drawerMain.classList.add(
        "absolute",
        "bottom-0",
        "w-[98.5vw]",
        "h-[98.5vh]",
        "rounded-lg-t-lg",
        "rounded-lg-b-none"
      );
    }
  }

  if (drawerBody) {
    if (isOpen) {
      drawerBody.classList.remove("items-center");
    } else {
      drawerBody.classList.add("items-center");
    }
  }

  if (isOpen) {
    document.body.classList.add("overflow-hidden");
  }
}
