"use strict"
//
const View = require('../../Views/View.web')
const commonComponents_tables = require('../../MMAppUICommonComponents/tables.web')
const commonComponents_forms = require('../../MMAppUICommonComponents/forms.web')
const commonComponents_navigationBarButtons = require('../../MMAppUICommonComponents/navigationBarButtons.web')

class ExchangeView extends View
{
    constructor(options, context)
    {
        super(options, context) // call super before `this`
        //
        const self = this
        { // options
            self.wallet = self.options.wallet
            if (!self.wallet) {
                throw self.constructor.name + " requires an options.wallet"
            }
        }
        self.setup()
    }
    setup()
    {
        const self = this
        self.setup_views()
    }
    setup_views()
    {
        const self = this
        {
            const layer = self.layer
            layer.style.webkitUserSelect = "none" // disable selection here but enable selectively
            layer.style.width = "100%"
            layer.style.height = "100%" // we're also set height in viewWillAppear when in a nav controller
            layer.style.boxSizing = "border-box"
            layer.style.backgroundColor = "#272527" // so we don't get a strange effect when pushing self on a stack nav view
            layer.style.color = "#c0c0c0" // temporary
            layer.style.overflowY = "auto"
            layer.classList.add("ClassNameForScrollingAncestorOfScrollToAbleElement") // so that we get autoscroll to form field inputs on mobile platforms
            layer.style.padding = "0 0 40px 0" // actually going to change paddingTop in self.viewWillAppear() if navigation controller
            layer.style.wordBreak = "break-all" // to get the text to wrap
        }
        { // validation message
            const layer = commonComponents_tables.New_inlineMessageDialogLayer(self.context, "", false)
            layer.style.width = "calc(100% - 30px)"
            layer.style.marginLeft = "16px"
            layer.ClearAndHideMessage()
            self.validationMessageLayer = layer
            self.layer.appendChild(layer)
        }
        { // form
            const containerLayer = document.createElement("div")
            self.form_containerLayer = containerLayer
            {
                self._setup_form_walletNameField()
                self._setup_form_emailField()
                self._setup_form_addressField()
            }
            self.layer.appendChild(containerLayer)
        }
    }

    _setup_form_walletNameField() { // Wallet Name
        const self = this
        const div = commonComponents_forms.New_fieldContainerLayer(self.context)
        div.style.paddingBottom = "10px" // special case
        {
            const labelLayer = commonComponents_forms.New_fieldTitle_labelLayer("You have in USD", self.context)
            div.appendChild(labelLayer)
            //
            const valueLayer = commonComponents_forms.New_fieldValue_textInputLayer(self.context, {
                placeholderText: "For your reference"
            })
            //valueLayer.value = self.wallet.walletLabel
            self.walletNameInputLayer = valueLayer
            valueLayer.addEventListener(
                "keypress",
                function(event)
                {
                    self.AWalletFieldInput_did_keypress(event)
                }
            )
            valueLayer.addEventListener(
                "keyup",
                function(event)
                {
                    self.AWalletFieldInput_did_keyup(event) // defined on super
                }
            )
            div.appendChild(valueLayer)
        }
        self.form_containerLayer.appendChild(div)
    }

    _setup_form_emailField() { // Wallet Name
        const self = this
        const div = commonComponents_forms.New_fieldContainerLayer(self.context)
        div.style.paddingBottom = "10px" // special case
        {
            const labelLayer = commonComponents_forms.New_fieldTitle_labelLayer("Your Email address", self.context)
            div.appendChild(labelLayer)
            //
            const valueLayer = commonComponents_forms.New_fieldValue_textInputLayer(self.context, {
                placeholderText: "For your reference"
            })
            //valueLayer.value = self.wallet.walletLabel
            self.walletNameInputLayer = valueLayer
            valueLayer.addEventListener(
                "keypress",
                function(event)
                {
                    self.AWalletFieldInput_did_keypress(event)
                }
            )
            valueLayer.addEventListener(
                "keyup",
                function(event)
                {
                    self.AWalletFieldInput_did_keyup(event) // defined on super
                }
            )
            div.appendChild(valueLayer)
        }
        self.form_containerLayer.appendChild(div)
    }

    _setup_form_addressField() { // Wallet Name
        const self = this
        const div = commonComponents_forms.New_fieldContainerLayer(self.context)
        div.style.paddingBottom = "10px" // special case
        {
            const labelLayer = commonComponents_forms.New_fieldTitle_labelLayer("Your Wallet Address", self.context)
            div.appendChild(labelLayer)
            //
            const valueLayer = commonComponents_forms.New_fieldValue_textInputLayer(self.context, {
                placeholderText: "For your reference"
            })
            //valueLayer.value = self.wallet.walletLabel
            self.walletNameInputLayer = valueLayer
            valueLayer.addEventListener(
                "keypress",
                function(event)
                {
                    self.AWalletFieldInput_did_keypress(event)
                }
            )
            valueLayer.addEventListener(
                "keyup",
                function(event)
                {
                    self.AWalletFieldInput_did_keyup(event) // defined on super
                }
            )
            div.appendChild(valueLayer)
        }
        self.form_containerLayer.appendChild(div)
    }

    //
    //
    // Runtime - Accessors - Navigation
    //
    Navigation_Title() {
        return "Buy Monero"
    }
    Navigation_New_LeftBarButtonView() {
        const self = this
        const view = commonComponents_navigationBarButtons.New_LeftSide_CancelButtonView(self.context)
        const layer = view.layer
        { // observe
            layer.addEventListener(
                "click",
                function(e)
                {
                    e.preventDefault()
                    { // v--- self.navigationController because self is presented packaged in a StackNavigationView
                        self.navigationController.modalParentView.DismissTopModalView(true)
                    }
                    return false
                }
            )
        }
        return view
    }
    //
    //
    // Runtime - Accessors - Lookups
    //
    _canEnableSubmitButton() {
        const self = this
        if (self.walletNameInputLayer.value.length == 0) {
            return false
        }
        if (self.isSaving == true) {
            return false
        }
        return true
    }
    //
    //
    // Runtime - Imperatives - Submit button enabled state
    //
    set_submitButtonNeedsUpdate() {
        const self = this
        setTimeout(function()
        { // to make sure consumers' prior updates have a chance to kick in
            // v- we use a local property instead of the one on the nav C cause we can't guarantee it is set yet
            self.rightBarButtonView.SetEnabled(self._canEnableSubmitButton())
        })
    }
    //
    //
    // Runtime - Delegation - Nav bar btn events - Overridable but call on super
    //
    _saveButtonView_pressed() {
        const self = this
        const walletColorHexString = self.walletColorPickerInputView.Component_Value()
        const walletName = self.walletNameInputLayer.value
        {
            self.isSaving = true
            self.set_submitButtonNeedsUpdate()
        }
        self.wallet.Set_valuesByKey(
            {
                walletLabel: walletName,
                swatch: walletColorHexString
            },
            function(err)
            {
                {
                    self.isSaving = false
                    self.set_submitButtonNeedsUpdate()
                }
                if (err) {
                    console.error("Error while saving wallet", err)
                    self.validationMessageLayer.SetValidationError(err.message)
                    return
                }
                self.validationMessageLayer.ClearAndHideMessage()
                //
                self._didSaveWallet()
            }
        )
    }
    //
    //
    // Runtime - Imperatives - UI
    //
    dismissView() {
        const self = this
        const modalParentView = self.navigationController.modalParentView
        setTimeout(function()
        { // just to make sure the PushView is finished
            modalParentView.DismissTopModalView(true)
        })
    }
    //
    //
    // Runtime - Delegation - Navigation/View lifecycle
    //
    viewWillAppear() {
        const self = this
        super.viewWillAppear()
        if (typeof self.navigationController !== 'undefined' && self.navigationController !== null) {
            self.layer.style.paddingTop = `${self.navigationController.NavigationBarHeight()}px`
        }
    }

    //
    //
    // Runtime - Delegation - Yield
    //
    _didSaveWallet() {
        const self = this
        self.dismissView()
    }
    //
    //
    // Runtime - Delegation - Interactions
    //
    AWalletFieldInput_did_keypress(event) {
        const self = this
        if (event.keyCode === 13) { // return key
            event.preventDefault() // do not let return/accept create a newline ; in case this is a textarea
            if (self.isSubmitButtonDisabled !== true) {
                self._saveButtonView_pressed() // patch to
            }
            return false // do not let return/accept create a newline
        }
        self.set_submitButtonNeedsUpdate()
    }
    AWalletFieldInput_did_keyup(event) {
        const self = this
        self.set_submitButtonNeedsUpdate()
    }
}
module.exports = ExchangeView