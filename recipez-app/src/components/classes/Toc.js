import React from 'react';
import {Component} from 'react';
import Modal from 'react-modal';

export default class Toc extends React.Component {
    constructor() {
        super();

        this.state = {
            modalOpen: false
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    //Helper method to open the modal
    openModal() {
        this.setState({modalOpen: true});
    }
    //Helper method to close the modal
    closeModal() {
        this.setState({modalOpen: false});
    }
    //Opens the modal on page load
    componentDidMount() {
        this.openModal();
    }

    render() {
        return (
        <div className="container">
            <Modal
                isOpen={this.state.modalOpen}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title"><strong>Terms and Conditions</strong></h4>
                    </div>
                    <!--Modal body-->
                    <div className="modal-body">
                        <p>
                            <ol>
                                <li><u>Introduction</u>
                                    <p>
                                        These Website Standard Terms and Conditions written on this webpage
                                        shall manage your use of this website. These Terms will be applied fully and
                                        affect to your use of this Website. By using this Website, you agreed to accept
                                        all terms and conditions written in here. You must not use this Website if you
                                        disagree with any of these Website Standard Terms and Conditions.
                                    </p>
                                </li>
                                <li><u>Intellectual Property Rights</u>
                                    <p>
                                        Other than the content you own, under these Terms, Kitchen Sync and/or its
                                        licensors own all the intellectual property rights and materials contained in this
                                        Website. You are granted limited license only for purposes of viewing the
                                        material contained on this Website.
                                    </p>
                                </li>
                                <li><u>Restrictions</u>
                                    <p>
                                        You are specifically restricted from all of the following:
                                        <ul>
                                            <li>publishing any Website material in any other media;</li>
                                            <li>selling, sublicensing and/or otherwise commercializing any
                                                Website material;</li>
                                            <li>publicly performing and/or showing any Website material;</li>
                                            <li>using this Website in any way that is or may be damaging to this
                                                Website;</li>
                                            <li>using this Website in any way that impacts user access to this
                                                Website;</li>
                                            <li>using this Website contrary to applicable laws and regulations,
                                                or in any way may cause harm to the Website, or to any person or business
                                                entity;</li>
                                            <li>engaging in any data mining, data harvesting, data extracting or
                                                any other similar activity in relation to this Website;</li>
                                            <li>using this Website to engage in any advertising or marketing.</li>
                                        </ul>
                                    </p>
                                    <p>
                                        Certain areas of this Website are restricted from being access by you
                                        and Kitchen Sync may further restrict access by you to any areas of this Website,
                                        at any time, in absolute discretion. Any email address and password you may have
                                        for this Website are confidential and you must maintain confidentiality as well.
                                    </p>
                                </li>
                                <li><u>Your Content</u>
                                    <p>
                                        In these Website Standard Terms and Conditions, “Your Content” shall
                                        mean any audio, video, text, images or other material you choose to display on
                                        this Website. By displaying Your Content, you grant Kitchen Sync a non-exclusive,
                                        worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish,
                                        translate and distribute it in any and all media.
                                    </p>
                                    <p>
                                        Your Content must be your own and must not be invading any third-party's
                                        rights. Kitchen Sync reserves the right to remove any of Your Content from this
                                        Website at any time without notice.
                                    </p>
                                </li>
                                <li><u>No Warranties</u>
                                    <p>
                                        This Website is provided “as is,” with all faults, and Kitchen Sync express no
                                        representations or warranties, of any kind related to this Website or the
                                        materials contained on this Website. Also, nothing contained on this Website shall
                                        be interpreted as advising you.
                                    </p>
                                </li>
                                <li><u>Limitation of Liability</u>
                                    <p>In no event shall Kitchen Sync, nor any of its officers, directors and employees,
                                        shall be held liable for anything arising out of or in any way connected
                                        with your use of this Website whether such liability is under contract. Kitchen
                                        Sync, including its officers, directors and employees shall not be held liable
                                        for any indirect, consequential or special liability arising out of or in any way
                                        related to your use of this Website.
                                    </p>
                                </li>
                                <li><u>Indemnification</u>
                                    <p>
                                        You hereby indemnify to the fullest extent Kitchen Sync from and against any
                                        and/or all liabilities, costs, demands, causes of action, damages and expenses
                                        arising in any way related to your breach of any of the provisions of these Terms.
                                    </p>
                                </li>
                                <li><u>Severability</u>
                                    <p>
                                        If any provision of these Terms is found to be invalid under any applicable law,
                                        such provisions shall be deleted without affecting the remaining provisions herein.
                                    </p>
                                </li>
                                <li><u>Variation of Terms</u>
                                    <p>
                                        Kitchen Sync is permitted to revise these Terms at any time as it sees fit, and
                                        by using this Website you are expected to review these Terms on a regular basis.
                                    </p>
                                </li>
                                <li><u>Assignment</u>
                                    <p>
                                        Kitchen Sync is allowed to assign, transfer, and subcontract its rights and/or
                                        obligations under these Terms without any notification. However, you are
                                        not allowed to assign, transfer, or subcontract any of your rights and/or
                                        obligations under these Terms.
                                    </p>
                                </li>
                                <li><u>Entire Agreement</u>
                                    <p>
                                        These Terms constitute the entire agreement between Kitchen Sync and you
                                        in relation to your use of this Website, and supersede all prior agreements and
                                        understandings.
                                    </p>
                                </li>
                                <li><u>Governing Law & Jurisdiction</u>
                                    <p>
                                        These Terms will be governed by and interpreted in accordance with the laws of
                                        the State of California, and you submit to the non-exclusive jurisdiction of
                                        the state and federal courts located in California for the resolution of any
                                        disputes.
                                    </p>
                                </li>
                            </ol>
                        </p>
                    </div>
                </div>

                <button type="button" id="button"  onClick={this.closeModal} >I Accept</button>

            </Modal>
        </div>
    );
    }
}
