/* portfolio.js — Interactive Bento Portfolio Controls */

document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // =========================================================================
    // TOAST NOTIFICATIONS
    // =========================================================================
    const toastContainer = document.getElementById("toast-container");
    const showToast = (message) => {
        if (!toastContainer) return;
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span></span>`;
        const span = toast.querySelector("span");
        if (span) span.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3200);
    };

    // =========================================================================
    // THEME TOGGLE (DARK / LIGHT)
    // =========================================================================
    const themeToggle = document.getElementById("theme-toggle");
    const applyTheme = (theme) => {
        html.dataset.theme = theme;
        try {
            localStorage.setItem("portfolio-theme", theme);
        } catch (_) { /* ignore storage restrictions */ }
        if (themeToggle) {
            themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
        }
    };

    const toggleTheme = () => {
        const next = html.dataset.theme === "light" ? "dark" : "light";
        applyTheme(next);
        showToast(`Switched to ${next} theme`);
    };

    if (themeToggle) {
        applyTheme(html.dataset.theme || "dark");
        themeToggle.addEventListener("click", toggleTheme);
    }

    // =========================================================================
    // NAVBAR SCROLL PROGRESS & ACTIVE SECTION SPY
    // =========================================================================
    const navbar = document.getElementById("top-nav");
    const scrollProgress = document.querySelector(".scroll-progress");
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const sections = Array.from(document.querySelectorAll("main section[id]"));

    let scrollTicking = false;
    const updateScrollUI = () => {
        const y = window.scrollY || window.pageYOffset;
        if (navbar) {
            navbar.classList.toggle("scrolled", y > 24);
        }
        if (scrollProgress) {
            const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const pct = maxScroll > 0 ? Math.min(100, Math.max(0, (y / maxScroll) * 100)) : 0;
            scrollProgress.style.width = `${pct}%`;
        }
        scrollTicking = false;
    };

    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(updateScrollUI);
            scrollTicking = true;
        }
    }, { passive: true });
    updateScrollUI();

    if ("IntersectionObserver" in window && sections.length && navLinks.length) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                });
            });
        }, { rootMargin: "-35% 0px -55% 0px" });

        sections.forEach((sec) => spyObserver.observe(sec));
    }

    // =========================================================================
    // MOBILE DRAWER
    // =========================================================================
    const mobileToggle = document.getElementById("mobile-toggle");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const mobileClose = document.getElementById("mobile-close");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    const setDrawerOpen = (open) => {
        if (!mobileDrawer || !mobileToggle) return;
        mobileDrawer.classList.toggle("open", open);
        mobileDrawer.setAttribute("aria-hidden", open ? "false" : "true");
        mobileToggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
    };

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener("click", () => setDrawerOpen(true));
        if (mobileClose) mobileClose.addEventListener("click", () => setDrawerOpen(false));
        mobileLinks.forEach((link) => link.addEventListener("click", () => setDrawerOpen(false)));
        mobileDrawer.addEventListener("click", (e) => {
            if (e.target === mobileDrawer) setDrawerOpen(false);
        });
    }

    // =========================================================================
    // SCROLL REVEAL
    // =========================================================================
    const revealEls = document.querySelectorAll(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
        revealEls.forEach((el) => revealObserver.observe(el));
    }

    // =========================================================================
    // BENTO CARD SPOTLIGHT TRACKING
    // =========================================================================
    if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
        document.querySelectorAll(".spotlight-surface").forEach((card) => {
            card.addEventListener("pointermove", (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
                card.style.setProperty("--my", `${e.clientY - rect.top}px`);
            });
        });
    }

    // =========================================================================
    // MINDCONNECT INTERACTIVE TABS
    // =========================================================================
    const previewTabs = document.querySelectorAll(".preview-tab");
    const previewPanels = document.querySelectorAll(".preview-panel");

    previewTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.tab;
            previewTabs.forEach((t) => {
                const active = t === tab;
                t.classList.toggle("active", active);
                t.setAttribute("aria-selected", active ? "true" : "false");
            });
            previewPanels.forEach((panel) => {
                const match = panel.dataset.panel === target;
                panel.hidden = !match;
                panel.classList.toggle("active", match);
            });
        });
    });

    // =========================================================================
    // PROJECT FILTER & DETAILS MODAL
    // =========================================================================
    const filterPills = document.querySelectorAll(".filter-pill");
    const projectCards = document.querySelectorAll(".project-card");
    const projectGroups = document.querySelectorAll(".projects-group");
    const projectCountBadge = document.getElementById("project-count");

    filterPills.forEach((pill) => {
        pill.addEventListener("click", () => {
            const filter = pill.dataset.filter || "all";
            filterPills.forEach((p) => p.classList.toggle("active", p === pill));

            let visibleTotal = 0;
            projectCards.forEach((card) => {
                const show = filter === "all" || card.dataset.category === filter;
                card.hidden = !show;
                if (show) visibleTotal += 1;
            });

            projectGroups.forEach((group) => {
                const anyVisible = group.querySelectorAll(".project-card:not([hidden])").length > 0;
                group.hidden = !anyVisible;
            });

            if (projectCountBadge) {
                projectCountBadge.textContent = String(visibleTotal);
            }
        });
    });

    // Parse embedded project JSON
    let projectsMap = new Map();
    const projectsDataEl = document.getElementById("projects-data");
    if (projectsDataEl && projectsDataEl.textContent) {
        try {
            const list = JSON.parse(projectsDataEl.textContent);
            list.forEach((item) => {
                if (item && item.id) projectsMap.set(item.id, item);
            });
        } catch (err) {
            console.error("Failed to parse projects-data JSON:", err);
        }
    }

    const projectModal = document.getElementById("project-modal");
    const pmTitle = document.getElementById("pm-title");
    const pmPeriod = document.getElementById("pm-period");
    const pmRole = document.getElementById("pm-role");
    const pmSummary = document.getElementById("pm-summary");
    const pmHighlights = document.getElementById("pm-highlights");
    const pmTech = document.getElementById("pm-tech");
    const pmGithub = document.getElementById("pm-github");
    const pmClose = document.getElementById("pm-close");
    const pmCloseBtn = document.getElementById("pm-close-btn");

    const closeProjectModal = () => {
        if (!projectModal) return;
        projectModal.hidden = true;
        document.body.style.overflow = "";
    };

    const openProjectModal = (projectId) => {
        const project = projectsMap.get(projectId);
        if (!project || !projectModal) return;

        if (pmTitle) pmTitle.textContent = project.name || "";
        if (pmPeriod) pmPeriod.textContent = project.period || "";
        if (pmRole) pmRole.textContent = project.role || "";
        if (pmSummary) pmSummary.textContent = project.summary || "";
        if (pmGithub) pmGithub.setAttribute("href", project.githubUrl || "#");

        if (pmHighlights) {
            pmHighlights.innerHTML = "";
            (project.highlights || []).forEach((text) => {
                const li = document.createElement("li");
                li.textContent = text;
                pmHighlights.appendChild(li);
            });
        }

        if (pmTech) {
            pmTech.innerHTML = "";
            (project.techTags || []).forEach((tag) => {
                const span = document.createElement("span");
                span.className = "tech-chip";
                span.textContent = tag;
                pmTech.appendChild(span);
            });
        }

        projectModal.hidden = false;
        document.body.style.overflow = "hidden";
    };

    document.querySelectorAll(".view-details-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            openProjectModal(btn.dataset.projectId);
        });
    });

    if (pmClose) pmClose.addEventListener("click", closeProjectModal);
    if (pmCloseBtn) pmCloseBtn.addEventListener("click", closeProjectModal);
    if (projectModal) {
        projectModal.addEventListener("click", (e) => {
            if (e.target === projectModal) closeProjectModal();
        });
    }

    // =========================================================================
    // COPY TO CLIPBOARD
    // =========================================================================
    const copyText = async (text, label) => {
        if (!text) return;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const ta = document.createElement("textarea");
                ta.value = text;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                ta.remove();
            }
            showToast(`${label || "Text"} copied to clipboard`);
        } catch (_) {
            showToast("Unable to copy to clipboard");
        }
    };

    document.addEventListener("click", (e) => {
        const trigger = e.target.closest("[data-copy]");
        if (!trigger) return;
        copyText(trigger.dataset.copy, trigger.dataset.copyLabel || "Value");
    });

    // =========================================================================
    // CONTACT COMPOSER (REAL MAILTO + COPY)
    // =========================================================================
    const composer = document.getElementById("contact-composer");
    const copyComposedBtn = document.getElementById("copy-composed-btn");

    const buildComposedPayload = () => {
        if (!composer) return null;
        const recipient = composer.dataset.recipient || "lephungha1203@gmail.com";
        const name = (composer.querySelector("#c-name")?.value || "").trim();
        const email = (composer.querySelector("#c-email")?.value || "").trim();
        const subject = (composer.querySelector("#c-subject")?.value || "").trim() || "Portfolio Inquiry";
        const message = (composer.querySelector("#c-message")?.value || "").trim();
        const body = `Hi Le Phung Ha,\n\n${message}\n\nBest regards,\n${name}${email ? ` (${email})` : ""}`;
        return { recipient, subject, body };
    };

    if (composer) {
        composer.addEventListener("submit", (e) => {
            e.preventDefault();
            const payload = buildComposedPayload();
            if (!payload) return;
            const mailtoUrl = `mailto:${encodeURIComponent(payload.recipient)}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
            window.location.href = mailtoUrl;
            showToast("Opening your email client...");
        });
    }

    if (copyComposedBtn) {
        copyComposedBtn.addEventListener("click", () => {
            const payload = buildComposedPayload();
            if (!payload) return;
            const formatted = `To: ${payload.recipient}\nSubject: ${payload.subject}\n\n${payload.body}`;
            copyText(formatted, "Formatted message");
        });
    }

    // =========================================================================
    // COMMAND PALETTE (CTRL+K / CMD+K)
    // =========================================================================
    const cmdPalette = document.getElementById("cmd-palette");
    const cmdOpenBtn = document.getElementById("cmd-open-btn");
    const cmdInput = document.getElementById("cmd-input");
    const cmdList = document.getElementById("cmd-list");

    const commands = [
        { label: "Go to Top / Hero", tag: "Section", icon: "fa-solid fa-house", action: () => { window.location.hash = "#hero"; } },
        { label: "Go to About & Credentials", tag: "Section", icon: "fa-solid fa-user", action: () => { window.location.hash = "#about"; } },
        { label: "Go to Industry Experience", tag: "Section", icon: "fa-solid fa-briefcase", action: () => { window.location.hash = "#experience"; } },
        { label: "Go to MindConnect Research", tag: "Section", icon: "fa-solid fa-flask", action: () => { window.location.hash = "#research"; } },
        { label: "Go to Projects", tag: "Section", icon: "fa-solid fa-code-branch", action: () => { window.location.hash = "#projects"; } },
        { label: "Go to Technical & Soft Skills", tag: "Section", icon: "fa-solid fa-sliders", action: () => { window.location.hash = "#skills"; } },
        { label: "Go to Contact", tag: "Section", icon: "fa-solid fa-envelope", action: () => { window.location.hash = "#contact"; } },
        { label: "Toggle Dark / Light Theme", tag: "Action", icon: "fa-solid fa-circle-half-stroke", action: toggleTheme },
        { label: "Copy Email (lephungha1203@gmail.com)", tag: "Copy", icon: "fa-regular fa-copy", action: () => copyText("lephungha1203@gmail.com", "Email address") },
        { label: "Copy Phone (034 737 2061)", tag: "Copy", icon: "fa-solid fa-phone", action: () => copyText("034 737 2061", "Phone number") },
        { label: "Download CV (PDF)", tag: "External", icon: "fa-solid fa-file-arrow-down", action: () => window.open("Le-Phung-Ha-CV.pdf", "_blank", "noopener") },
        { label: "Open GitHub (ChykenHa)", tag: "External", icon: "fa-brands fa-github", action: () => window.open("https://github.com/ChykenHa", "_blank", "noopener") },
        { label: "Open LinkedIn Profile", tag: "External", icon: "fa-brands fa-linkedin-in", action: () => window.open("https://www.linkedin.com/in/h%C3%A0-l%C3%AA-ph%C3%B9ng-24110137b/", "_blank", "noopener") }
    ];

    let filteredCommands = [...commands];
    let selectedIdx = 0;

    const closeCmdPalette = () => {
        if (!cmdPalette) return;
        cmdPalette.hidden = true;
        document.body.style.overflow = "";
    };

    const renderCommands = () => {
        if (!cmdList) return;
        cmdList.innerHTML = "";
        if (!filteredCommands.length) {
            const empty = document.createElement("li");
            empty.className = "cmd-item";
            empty.textContent = "No matching commands.";
            cmdList.appendChild(empty);
            return;
        }

        filteredCommands.forEach((cmd, idx) => {
            const li = document.createElement("li");
            li.className = `cmd-item${idx === selectedIdx ? " selected" : ""}`;
            li.setAttribute("role", "option");
            li.innerHTML = `<i class="${cmd.icon}" aria-hidden="true"></i><span></span><span class="cmd-item-tag"></span>`;
            const spans = li.querySelectorAll("span");
            if (spans[0]) spans[0].textContent = cmd.label;
            if (spans[1]) spans[1].textContent = cmd.tag;
            li.addEventListener("click", () => {
                closeCmdPalette();
                cmd.action();
            });
            cmdList.appendChild(li);
        });
    };

    const openCmdPalette = () => {
        if (!cmdPalette) return;
        filteredCommands = [...commands];
        selectedIdx = 0;
        if (cmdInput) cmdInput.value = "";
        renderCommands();
        cmdPalette.hidden = false;
        document.body.style.overflow = "hidden";
        if (cmdInput) cmdInput.focus();
    };

    if (cmdOpenBtn) cmdOpenBtn.addEventListener("click", openCmdPalette);
    if (cmdPalette) {
        cmdPalette.addEventListener("click", (e) => {
            if (e.target === cmdPalette) closeCmdPalette();
        });
    }

    if (cmdInput) {
        cmdInput.addEventListener("input", () => {
            const q = cmdInput.value.trim().toLowerCase();
            filteredCommands = commands.filter((c) => c.label.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q));
            selectedIdx = 0;
            renderCommands();
        });

        cmdInput.addEventListener("keydown", (e) => {
            if (!filteredCommands.length) return;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                selectedIdx = (selectedIdx + 1) % filteredCommands.length;
                renderCommands();
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                selectedIdx = (selectedIdx - 1 + filteredCommands.length) % filteredCommands.length;
                renderCommands();
            } else if (e.key === "Enter") {
                e.preventDefault();
                const chosen = filteredCommands[selectedIdx];
                if (chosen) {
                    closeCmdPalette();
                    chosen.action();
                }
            }
        });
    }

    // Global keyboard shortcuts
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (cmdPalette && !cmdPalette.hidden) closeCmdPalette();
            else openCmdPalette();
            return;
        }
        if (e.key === "Escape") {
            if (cmdPalette && !cmdPalette.hidden) closeCmdPalette();
            if (projectModal && !projectModal.hidden) closeProjectModal();
            if (mobileDrawer && mobileDrawer.classList.contains("open")) setDrawerOpen(false);
        }
    });
});
