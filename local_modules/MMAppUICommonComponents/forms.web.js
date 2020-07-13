// Copyright (c) 2014-2019, MyMonero.com
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//	of conditions and the following disclaimer in the documentation and/or other
//	materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//	used to endorse or promote products derived from this software without specific
//	prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
"use strict"

const View = require('../Views/View.web')

function New_fieldContainerLayer(context) {
    const layer = document.createElement("div")
    layer.className = "form_field"
    return layer
}

exports.New_fieldContainerLayer = New_fieldContainerLayer

function New_fieldTitle_labelLayer(labelText, context) {
    const layer = document.createElement("span")
    layer.className = "field_title"
    layer.innerHTML = labelText
    layer.classList.add('label-layer')

    context.themeController.StyleLayer_FontAsSmallRegularMonospace(layer)

    return layer
}

exports.New_fieldTitle_labelLayer = New_fieldTitle_labelLayer

function New_fieldTitle_rightSide_accessoryLayer(labelText, context) {
    const layer = New_fieldTitle_labelLayer("optional", context)
    layer.classList.add('label-right-side-accessory');

    return layer
}

exports.New_fieldTitle_rightSide_accessoryLayer = New_fieldTitle_rightSide_accessoryLayer

function ClassNameForScrollingAncestorOfScrollToAbleElement() {
    return "ClassNameForScrollingAncestorOfScrollToAbleElement"
}

exports.ClassNameForScrollingAncestorOfScrollToAbleElement = ClassNameForScrollingAncestorOfScrollToAbleElement

function ScrollCurrentFormElementIntoView() { // not a factory but a convenience function for call, e.g.. on window resize
    const activeElement = document.activeElement
    if (activeElement) {
        const tagName = activeElement.tagName
        if (tagName == "INPUT" || tagName == "TEXTAREA") {
            const scrollToView_fn = activeElement.Component_ScrollIntoViewInFormContainerParent
            // does it conform to informal 'protocol'?
            // doing it this way instead of just calling _shared_scrollElementIntoView…
            // so that elements can declare if they want to conform
            if (scrollToView_fn && typeof scrollToView_fn === "function") {
                scrollToView_fn.apply(activeElement)
            }
        }
    }
}

exports.ScrollCurrentFormElementIntoView = ScrollCurrentFormElementIntoView

var LocalVendor_ScrollPositionEndFixed_Animate = null

function _shared_scrollConformingElementIntoView(inputLayer) {
    const selector = `.${ClassNameForScrollingAncestorOfScrollToAbleElement()}`
    const scrollingAncestor = inputLayer.closest(selector)
    if (!scrollingAncestor || typeof scrollingAncestor === 'undefined') {
        console.warn("⚠️  Asked to _shared_scrollConformingElementIntoView but no scrollingAncestor found")
        return
    }
    // NOTE: velocity 1.5.0 is waiting on v2 to introduce a fix for
    // bug in scrolling to element who is wrapped in a relative parent
    // before its scrollable ancestor (showing bug on e.g. Contact picker);
    // so patch was manually applied. See local vendored velocity.js header
    // for note with github issues.
    { // lazy require to avoid usage in e.g. electron; hopefully the perf hit will not be noticed
        if (LocalVendor_ScrollPositionEndFixed_Animate == null) {
            LocalVendor_ScrollPositionEndFixed_Animate = require('../Animation/Vendor/velocity')
            // ^-- hopefully it will not cause problems to have multiple velocity modules connected to the same DOM
        }
    }
    LocalVendor_ScrollPositionEndFixed_Animate(inputLayer, "stop")
    LocalVendor_ScrollPositionEndFixed_Animate(scrollingAncestor, "stop")
    const navBarHeight = 44 // janky/fragile
    const topMargin = 20 // to clear the form title labels - would be nice to source these from shared constants/metrics
    LocalVendor_ScrollPositionEndFixed_Animate(
        inputLayer,
        "scroll",
        {
            container: scrollingAncestor,
            duration: 500,
            offset: -1 * (topMargin + navBarHeight)
        }
    )
}

exports._shared_scrollConformingElementIntoView = _shared_scrollConformingElementIntoView

function New_fieldValue_textInputLayer(context, params) {
    const layer = document.createElement("input")
    layer.className = "field_value"
    layer.type = params.customInputType || "text"
    layer.style.display = "block" // own line
    const existingValue = params.existingValue
    if (typeof existingValue !== 'undefined' && existingValue !== null) {
        layer.value = existingValue
    }
    const placeholderText = params.placeholderText
    if (typeof placeholderText !== 'undefined' && placeholderText !== null) {
        layer.placeholder = placeholderText
    }

    layer.Component_default_padding_h = function () {
        return 7
    } // H for horizontal

    layer.Component_default_h = function () {
        return 29
    } // H for height
    layer.classList.add('form-text-input')
    if (typeof params.target_width !== 'undefined') {
        const width = params.target_width - 16
        layer.style.width = width + "px"
    } else {
        layer.style.width = `calc(100% - 16px)`
    }
    // editable:true
    if (context.Views_selectivelyEnableMobileRenderingOptimizations !== true) {
        layer.style.boxShadow = "0 0.5px 0 0 rgba(56,54,56,0.50), inset 0 0.5px 0 0 #161416"
    } else { // avoiding shadow
        layer.style.boxShadow = "inset 0 0.5px 0 0 #161416"
    }

    layer.disabled = false
    layer.Component_ScrollIntoViewInFormContainerParent = function () { // this could also be called on window resize
        const this_layer = this
        _shared_scrollConformingElementIntoView(this_layer)
    }
    if (context.CommonComponents_Forms_scrollToInputOnFocus == true) {
        layer.addEventListener(
            "focus",
            function () {
                layer.Component_ScrollIntoViewInFormContainerParent()
            }
        )
    }
    return layer
}

exports.New_fieldValue_textInputLayer = New_fieldValue_textInputLayer

function New_fieldValue_textAreaView(params, context) {
    const view = new View({tag: "textarea"}, context)
    const layer = view.layer
    layer.className = "field_value"
    const existingValue = params.existingValue
    if (typeof existingValue !== 'undefined' && existingValue !== null) {
        layer.value = existingValue
    }
    const placeholderText = params.placeholderText
    if (typeof placeholderText !== 'undefined' && placeholderText !== null) {
        layer.placeholder = placeholderText
    }
    layer.classList.add('form-text-area')
    //
    view.SetEnabled = function (isEnabled) {
        if (isEnabled) {
            if (context.Views_selectivelyEnableMobileRenderingOptimizations !== true) {
                layer.style.boxShadow = "0 0.5px 0 0 rgba(56,54,56,0.50), inset 0 0.5px 0 0 #161416"
            } else { // avoiding shadow
                layer.style.boxShadow = "inset 0 0.5px 0 0 #161416"
            }
            //
            layer.style.color = "#dfdedf"
            layer.style.backgroundColor = "#1d1b1d"
            layer.disabled = undefined
        } else {
            layer.style.boxShadow = "none"
            //
            layer.style.color = "#dfdedf"
            layer.style.backgroundColor = "#1d1b1d"
            layer.disabled = true
        }
        view.isEnabled = isEnabled // this going to cause a retain cycle ?
    }
    view.SetEnabled(true) // to get initial styling, any state, et al.
    //
    // putting this on layer instead of view for now to conform to informal 'protocol' of ScrollCurrentFormElementIntoView
    layer.Component_ScrollIntoViewInFormContainerParent = function () {
        const this_layer = this
        _shared_scrollConformingElementIntoView(this_layer)
    }
    if (context.CommonComponents_Forms_scrollToInputOnFocus == true) {
        layer.addEventListener(
            "focus",
            function () {
                // TODO: retain cycle?
                layer.Component_ScrollIntoViewInFormContainerParent()
            }
        )
    }
    //
    return view
}

exports.New_fieldValue_textAreaView = New_fieldValue_textAreaView

function New_fieldAccessory_messageLayer(context) {
    const layer = document.createElement("p")
    context.themeController.StyleLayer_FontAsMessageBearingSmallLightMonospace(layer) // name needs improvement
    layer.classList.add('form-accessory-message')
    return layer
}

exports.New_fieldAccessory_messageLayer = New_fieldAccessory_messageLayer

function New_fieldAccessory_validationMessageLayer(context) {
    const layer = New_fieldAccessory_messageLayer(context)
    layer.style.color = "#f97777"
    return layer
}

exports.New_fieldAccessory_validationMessageLayer = New_fieldAccessory_validationMessageLayer

function New_NonEditable_ValueDisplayLayer_BreakChar(value, context) {
    const layer = document.createElement("div")
    layer.value = value // setting this so there is a common interface with _textView above - some consumers rely on it. this should be standardized into a Value() method of a View
    layer.classList.add('value-display-break-char')
    layer.innerHTML = value

    return layer
}

exports.New_NonEditable_ValueDisplayLayer_BreakChar = New_NonEditable_ValueDisplayLayer_BreakChar

function New_Detected_IconAndMessageLayer(context) {
    const iconPath = context.crossPlatform_appBundledIndexRelativeAssetsRootPath + "MMAppUICommonComponents/Resources/detectedCheckmark@3x.png";
    const optl_imgW = "9px"
    const optl_imgH = "7px"
    const layer = document.createElement("div")
    layer.classList.add("iconAndMessageLayer")
    layer.innerHTML = `<img src="${iconPath}" ${optl_imgW ? 'width="' + optl_imgW + '"' : ""} ${optl_imgH ? 'height="' + optl_imgH + '"' : ""} />&nbsp;<span>Detected</span>`
    layer.classList.add('form-icon-message')

    return layer
}

exports.New_Detected_IconAndMessageLayer = New_Detected_IconAndMessageLayer