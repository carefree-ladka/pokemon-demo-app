import React, { forwardRef } from "react"

export default forwardRef((props, ref) => {
  return (
    <dialog
      {...props}
      ref={ref}
      className="fixed inset-0 z-50 bg-white w-full h-full max-w-none max-h-none m-0 p-0 overflow-y-auto md:inset-4 md:w-auto md:h-auto md:max-w-4xl md:max-h-[90vh] md:mx-auto md:my-8 md:rounded-lg md:shadow-xl backdrop-blur-sm"
    >
      <div className="min-h-full md:min-h-0">
        {props.children}
      </div>
    </dialog>
  )
})
