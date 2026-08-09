import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { supabase } from "../supabaseClient";

import "../css/settings.css";

const DEFAULT_SETTINGS = {
    company_name: "GKT Software Solution",
    email: "gktsoftwaresolution@gmail.com",
    phone: "8778341227",
    address: "Chennai, Tamil Nadu, India",
    website: "",
};

function Settings() {
    const [form, setForm] =
        useState({ ...DEFAULT_SETTINGS });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [settingsId, setSettingsId] =
        useState(null);

    // =====================================================
    // LOAD SETTINGS
    // =====================================================

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);

            const { data, error } =
                await supabase
                    .from("settings")
                    .select("*")
                    .limit(1)
                    .maybeSingle();

            if (error) {
                throw error;
            }

            if (data) {

                setSettingsId(data.id);

                setForm({
                    company_name:
                        data.company_name ||
                        DEFAULT_SETTINGS.company_name,

                    email:
                        data.email ||
                        DEFAULT_SETTINGS.email,

                    phone:
                        data.phone ||
                        DEFAULT_SETTINGS.phone,

                    address:
                        data.address ||
                        DEFAULT_SETTINGS.address,

                    website:
                        data.website ||
                        "",
                });

            }

        } catch (error) {

            console.error(
                "FETCH SETTINGS ERROR:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Unable to load settings",
                text:
                    error.message ||
                    "Could not load company settings.",
            });

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // SAVE
    // =====================================================

    const saveSettings = async (e) => {

        e.preventDefault();

        if (!form.company_name.trim()) {

            Swal.fire({
                icon: "warning",
                title: "Company name required",
                text: "Please enter your company name.",
            });

            return;
        }

        if (!form.email.trim()) {

            Swal.fire({
                icon: "warning",
                title: "Email required",
                text: "Please enter your company email.",
            });

            return;
        }

        try {

            setSaving(true);

            const settingsData = {
                company_name:
                    form.company_name.trim(),

                email:
                    form.email.trim(),

                phone:
                    form.phone.trim(),

                address:
                    form.address.trim(),

                website:
                    form.website.trim(),

                updated_at:
                    new Date().toISOString(),
            };

            // =================================================
            // UPDATE EXISTING
            // =================================================

            if (settingsId) {

                const { error } =
                    await supabase
                        .from("settings")
                        .update(
                            settingsData
                        )
                        .eq(
                            "id",
                            settingsId
                        );

                if (error) {
                    throw error;
                }

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                const { data, error } =
                    await supabase
                        .from("settings")
                        .insert([
                            settingsData,
                        ])
                        .select()
                        .single();

                if (error) {
                    throw error;
                }

                setSettingsId(data.id);
            }

            Swal.fire({
                icon: "success",
                title: "Settings Saved",
                text:
                    "Company settings updated successfully.",
                timer: 1600,
                showConfirmButton: false,
            });

        } catch (error) {

            console.error(
                "SAVE SETTINGS ERROR:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Save Failed",
                text:
                    error.message ||
                    "Unable to save settings.",
            });

        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // RESET
    // =====================================================

    const resetSettings = async () => {

        const result =
            await Swal.fire({
                title: "Reset settings?",
                text:
                    "Restore the default company information.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText:
                    "Yes, reset",
                cancelButtonText:
                    "Cancel",
            });

        if (!result.isConfirmed) {
            return;
        }

        setForm({
            ...DEFAULT_SETTINGS,
        });
    };

    return (
        <>
            <Sidebar />

            <div className="dashboard-main">

                <Topbar />

                <div className="dashboard-content">

                    <div className="settings-page">

                        <div className="settings-header">

                            <div>
                                <h2>
                                    ⚙️ Settings
                                </h2>

                                <p>
                                    Manage your company
                                    information and
                                    contact details.
                                </p>
                            </div>

                        </div>

                        <div className="settings-card">

                            {loading ? (
                                <div className="settings-loading">
                                    Loading settings...
                                </div>
                            ) : (

                                <form
                                    onSubmit={
                                        saveSettings
                                    }
                                >

                                    <div className="settings-section">

                                        <h3>
                                            Company Information
                                        </h3>

                                        <p>
                                            This information
                                            can be used
                                            throughout your
                                            admin dashboard.
                                        </p>

                                    </div>

                                    {/* COMPANY */}

                                    <div className="form-group">

                                        <label htmlFor="company_name">
                                            Company Name
                                        </label>

                                        <input
                                            id="company_name"
                                            type="text"
                                            name="company_name"
                                            value={
                                                form.company_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Company name"
                                            disabled={
                                                saving
                                            }
                                            required
                                        />

                                    </div>

                                    {/* EMAIL */}

                                    <div className="form-group">

                                        <label htmlFor="email">
                                            Email
                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={
                                                form.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Company email"
                                            disabled={
                                                saving
                                            }
                                            required
                                        />

                                    </div>

                                    {/* PHONE */}

                                    <div className="form-group">

                                        <label htmlFor="phone">
                                            Phone
                                        </label>

                                        <input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={
                                                form.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Phone number"
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>

                                    {/* ADDRESS */}

                                    <div className="form-group">

                                        <label htmlFor="address">
                                            Address
                                        </label>

                                        <textarea
                                            id="address"
                                            name="address"
                                            rows="4"
                                            value={
                                                form.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Company address"
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>

                                    {/* WEBSITE */}

                                    <div className="form-group">

                                        <label htmlFor="website">
                                            Website
                                        </label>

                                        <input
                                            id="website"
                                            type="url"
                                            name="website"
                                            value={
                                                form.website
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="https://example.com"
                                            disabled={
                                                saving
                                            }
                                        />

                                    </div>

                                    {/* BUTTONS */}

                                    <div className="settings-actions">

                                        <button
                                            type="button"
                                            className="reset-btn"
                                            onClick={
                                                resetSettings
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            Reset
                                        </button>

                                        <button
                                            type="submit"
                                            className="save-btn"
                                            disabled={
                                                saving
                                            }
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save Settings"}
                                        </button>

                                    </div>

                                </form>

                            )}

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Settings;