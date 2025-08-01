// SypnexAPI UI Components - Modal dialogs, confirmations, file pickers, etc.
// This file extends the SypnexAPI class with UI component functionality

// Extend SypnexAPI with UI methods
Object.assign(SypnexAPI.prototype, {

    /**
     * Show a confirmation dialog with standard OS styling
     * @async
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {object} [options={}] - Configuration options
     * @param {string} [options.confirmText='Yes'] - Text for confirm button
     * @param {string} [options.cancelText='No'] - Text for cancel button
     * @param {string} [options.type='warning'] - Dialog type: 'warning', 'danger', 'info'
     * @param {string} [options.icon='fas fa-exclamation-triangle'] - FontAwesome icon class
     * @returns {Promise<boolean>} True if confirmed, false if cancelled
     */
    async showConfirmation(title, message, options = {}) {
        const {
            confirmText = 'Yes',
            cancelText = 'No',
            type = 'warning',
            icon = 'fas fa-exclamation-triangle'
        } = options;

        return new Promise((resolve) => {
            // Remove any existing confirmation modal
            const existingModal = document.getElementById('sypnex-confirmation-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Create the modal with proper OS styling
            const modal = document.createElement('div');
            modal.id = 'sypnex-confirmation-modal';
            modal.style.cssText = `
                display: block;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
            `;

            // Create modal content with proper structure
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background-color: var(--glass-bg);
                margin: 5% auto;
                padding: 0;
                border: 1px solid var(--glass-border);
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                backdrop-filter: blur(10px);
            `;

            // Modal header
            const modalHeader = document.createElement('div');
            modalHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid var(--glass-border);
            `;

            const headerTitle = document.createElement('h3');
            headerTitle.style.cssText = `
                margin: 0;
                color: var(--text-primary);
            `;
            headerTitle.innerHTML = `<i class="${icon}"></i> ${title}`;

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--text-secondary);
            `;
            closeBtn.onmouseover = () => closeBtn.style.color = 'var(--text-primary)';
            closeBtn.onmouseout = () => closeBtn.style.color = 'var(--text-secondary)';

            modalHeader.appendChild(headerTitle);
            modalHeader.appendChild(closeBtn);

            // Modal body
            const modalBody = document.createElement('div');
            modalBody.style.cssText = `padding: 20px;`;

            const messageP = document.createElement('p');
            messageP.style.cssText = `
                color: var(--text-primary);
                margin: 0 0 15px 0;
                line-height: 1.5;
            `;
            messageP.textContent = message;
            modalBody.appendChild(messageP);

            // Add warning text for danger type
            if (type === 'danger') {
                const warningP = document.createElement('p');
                warningP.style.cssText = `
                    color: var(--error-color);
                    margin: 10px 0 0 0;
                    font-size: 14px;
                    font-style: italic;
                `;
                warningP.textContent = 'This action cannot be undone.';
                modalBody.appendChild(warningP);
            }

            // Modal footer
            const modalFooter = document.createElement('div');
            modalFooter.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 20px;
                border-top: 1px solid var(--glass-border);
            `;

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = cancelText;
            cancelBtn.className = 'app-btn secondary';

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = confirmText;
            confirmBtn.className = `app-btn ${type === 'danger' ? 'danger' : 'primary'}`;

            modalFooter.appendChild(cancelBtn);
            modalFooter.appendChild(confirmBtn);

            // Assemble modal
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(modalBody);
            modalContent.appendChild(modalFooter);
            modal.appendChild(modalContent);

            // Add to document
            document.body.appendChild(modal);

            // Setup event handlers
            const closeModal = (confirmed) => {
                modal.remove();
                resolve(confirmed);
                document.removeEventListener('keydown', escapeHandler);
            };

            // Event listeners
            closeBtn.addEventListener('click', () => closeModal(false));
            cancelBtn.addEventListener('click', () => closeModal(false));
            confirmBtn.addEventListener('click', () => closeModal(true));

            // Escape key to close
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal(false);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    },

    /**
     * Show an input modal for getting text input from user
     * @param {string} title - Modal title
     * @param {string} message - Modal message/label
     * @param {object} [options={}] - Configuration options
     * @param {string} [options.placeholder=''] - Input placeholder text
     * @param {string} [options.defaultValue=''] - Default input value
     * @param {string} [options.confirmText='Create'] - Text for confirm button
     * @param {string} [options.cancelText='Cancel'] - Text for cancel button
     * @param {string} [options.icon='fas fa-edit'] - FontAwesome icon class
     * @param {string} [options.inputType='text'] - Input type: 'text', 'textarea'
     * @returns {Promise<string|null>} Input value if confirmed, null if cancelled
     */
    async showInputModal(title, message, options = {}) {
        const {
            placeholder = '',
            defaultValue = '',
            confirmText = 'Create',
            cancelText = 'Cancel',
            icon = 'fas fa-edit',
            inputType = 'text'
        } = options;

        return new Promise((resolve) => {
            // Remove any existing modal
            const existingModal = document.getElementById('sypnex-input-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Create the modal
            const modal = document.createElement('div');
            modal.id = 'sypnex-input-modal';
            modal.style.cssText = `
                display: block;
                position: fixed;
                z-index: 11000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            `;

            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: var(--glass-bg);
                margin: 5% auto;
                padding: 0;
                border: 1px solid var(--glass-border);
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            `;

            // Modal header
            const modalHeader = document.createElement('div');
            modalHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid var(--glass-border);
                background: var(--glass-bg);
                border-radius: 12px 12px 0 0;
            `;

            const headerTitle = document.createElement('h3');
            headerTitle.style.cssText = `
                margin: 0;
                color: var(--text-primary);
                font-size: 1.2em;
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            headerTitle.innerHTML = `<i class="${icon}" style="color: var(--accent-color);"></i> ${title}`;

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5em;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s ease;
            `;
            closeBtn.onmouseover = () => {
                closeBtn.style.background = 'rgba(255, 71, 87, 0.1)';
                closeBtn.style.color = '#ff4757';
                closeBtn.style.transform = 'scale(1.1)';
            };
            closeBtn.onmouseout = () => {
                closeBtn.style.background = 'none';
                closeBtn.style.color = 'var(--text-secondary)';
                closeBtn.style.transform = 'scale(1)';
            };

            modalHeader.appendChild(headerTitle);
            modalHeader.appendChild(closeBtn);

            // Modal body
            const modalBody = document.createElement('div');
            modalBody.style.cssText = `
                padding: 20px;
                background: var(--glass-bg);
            `;

            const label = document.createElement('label');
            label.style.cssText = `
                display: block;
                margin-bottom: 5px;
                color: var(--text-primary);
                font-weight: bold;
                font-size: 14px;
            `;
            label.textContent = message;

            let input;
            if (inputType === 'textarea') {
                input = document.createElement('textarea');
                input.style.cssText = `
                    width: 100%;
                    padding: 10px;
                    border: 1px solid var(--glass-border);
                    border-radius: 6px;
                    background: rgba(20, 20, 20, 0.8);
                    color: var(--text-primary);
                    font-family: inherit;
                    font-size: 14px;
                    resize: vertical;
                    min-height: 120px;
                    box-sizing: border-box;
                `;
            } else {
                input = document.createElement('input');
                input.type = 'text';
                input.style.cssText = `
                    width: 100%;
                    padding: 10px;
                    border: 1px solid var(--glass-border);
                    border-radius: 6px;
                    background: rgba(20, 20, 20, 0.8);
                    color: var(--text-primary);
                    font-family: inherit;
                    font-size: 14px;
                    box-sizing: border-box;
                `;
            }

            input.placeholder = placeholder;
            input.value = defaultValue;

            input.onfocus = () => {
                input.style.borderColor = 'var(--accent-color)';
                input.style.boxShadow = '0 0 0 2px rgba(0, 212, 255, 0.2)';
            };
            input.onblur = () => {
                input.style.borderColor = 'var(--glass-border)';
                input.style.boxShadow = 'none';
            };

            modalBody.appendChild(label);
            modalBody.appendChild(input);

            // Modal footer
            const modalFooter = document.createElement('div');
            modalFooter.style.cssText = `
                padding: 20px;
                border-top: 1px solid var(--glass-border);
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                background: var(--glass-bg);
                border-radius: 0 0 12px 12px;
            `;

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = cancelText;
            cancelBtn.className = 'app-btn secondary';

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = confirmText;
            confirmBtn.className = 'app-btn primary';

            modalFooter.appendChild(cancelBtn);
            modalFooter.appendChild(confirmBtn);

            // Assemble modal
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(modalBody);
            modalContent.appendChild(modalFooter);
            modal.appendChild(modalContent);

            // Add to document
            document.body.appendChild(modal);

            // Focus the input
            setTimeout(() => input.focus(), 100);

            // Setup event handlers
            const closeModal = (inputValue) => {
                modal.remove();
                resolve(inputValue);
                document.removeEventListener('keydown', escapeHandler);
            };

            // Event listeners
            closeBtn.addEventListener('click', () => closeModal(null));
            cancelBtn.addEventListener('click', () => closeModal(null));
            confirmBtn.addEventListener('click', () => {
                const value = input.value.trim();
                if (value) {
                    closeModal(value);
                }
            });

            // Enter key to confirm
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (inputType !== 'textarea' || e.ctrlKey)) {
                    e.preventDefault();
                    const value = input.value.trim();
                    if (value) {
                        closeModal(value);
                    }
                }
            });

            // Escape key to close
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal(null);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    },

    /**
     * Show a file upload modal
     * @param {string} title - Modal title
     * @param {string} message - Modal message/label
     * @param {object} [options={}] - Configuration options
     * @param {string} [options.confirmText='Upload'] - Text for confirm button
     * @param {string} [options.cancelText='Cancel'] - Text for cancel button
     * @param {string} [options.icon='fas fa-upload'] - FontAwesome icon class
     * @param {string} [options.accept='*'] - File accept types
     * @returns {Promise<File|null>} Selected file if confirmed, null if cancelled
     */
    async showFileUploadModal(title, message, options = {}) {
        const {
            confirmText = 'Upload',
            cancelText = 'Cancel',
            icon = 'fas fa-upload',
            accept = '*',
            uploadCallback = null
        } = options;

        return new Promise((resolve) => {
            // Remove any existing modal
            const existingModal = document.getElementById('sypnex-upload-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Create the modal
            const modal = document.createElement('div');
            modal.id = 'sypnex-upload-modal';
            modal.style.cssText = `
                display: block;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            `;

            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: var(--glass-bg);
                margin: 5% auto;
                padding: 0;
                border: 1px solid var(--glass-border);
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            `;

            // Modal header
            const modalHeader = document.createElement('div');
            modalHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid var(--glass-border);
                background: var(--glass-bg);
                border-radius: 12px 12px 0 0;
            `;

            const headerTitle = document.createElement('h3');
            headerTitle.style.cssText = `
                margin: 0;
                color: var(--text-primary);
                font-size: 1.2em;
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            headerTitle.innerHTML = `<i class="${icon}" style="color: var(--accent-color);"></i> ${title}`;

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5em;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s ease;
            `;
            closeBtn.onmouseover = () => {
                closeBtn.style.background = 'rgba(255, 71, 87, 0.1)';
                closeBtn.style.color = '#ff4757';
                closeBtn.style.transform = 'scale(1.1)';
            };
            closeBtn.onmouseout = () => {
                closeBtn.style.background = 'none';
                closeBtn.style.color = 'var(--text-secondary)';
                closeBtn.style.transform = 'scale(1)';
            };

            modalHeader.appendChild(headerTitle);
            modalHeader.appendChild(closeBtn);

            // Modal body
            const modalBody = document.createElement('div');
            modalBody.style.cssText = `
                padding: 20px;
                background: var(--glass-bg);
            `;

            const label = document.createElement('label');
            label.style.cssText = `
                display: block;
                margin-bottom: 5px;
                color: var(--text-primary);
                font-weight: bold;
                font-size: 14px;
            `;
            label.textContent = message;

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = accept;
            fileInput.style.cssText = `
                display: none;
            `;

            // Custom file input button
            const customFileBtn = document.createElement('button');
            customFileBtn.type = 'button';
            customFileBtn.className = 'app-btn secondary';
            customFileBtn.style.cssText = `
                width: 100%;
                padding: 12px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                border: 2px dashed var(--glass-border);
                background: rgba(0, 212, 255, 0.05);
                transition: all 0.3s ease;
            `;
            customFileBtn.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Choose File to Upload</span>
            `;

            customFileBtn.onmouseover = () => {
                customFileBtn.style.borderColor = 'var(--accent-color)';
                customFileBtn.style.background = 'rgba(0, 212, 255, 0.1)';
                customFileBtn.style.transform = 'translateY(-1px)';
            };
            customFileBtn.onmouseout = () => {
                customFileBtn.style.borderColor = 'var(--glass-border)';
                customFileBtn.style.background = 'rgba(0, 212, 255, 0.05)';
                customFileBtn.style.transform = 'translateY(0)';
            };

            // Click handler for custom button
            customFileBtn.addEventListener('click', () => {
                fileInput.click();
            });

            // File info display
            const fileInfo = document.createElement('div');
            fileInfo.style.cssText = `
                display: none;
                background: rgba(0, 212, 255, 0.1);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 6px;
                padding: 10px;
                margin-top: 10px;
            `;

            // Progress bar container (hidden initially)
            const progressContainer = document.createElement('div');
            progressContainer.style.cssText = `
                display: none;
                margin-top: 15px;
            `;

            const progressLabel = document.createElement('div');
            progressLabel.style.cssText = `
                color: var(--text-primary);
                font-size: 14px;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            progressLabel.innerHTML = `
                <span>Uploading...</span>
                <span class="progress-percent">0%</span>
            `;

            const progressBarBg = document.createElement('div');
            progressBarBg.style.cssText = `
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                border: 1px solid var(--glass-border);
            `;

            const progressBarFill = document.createElement('div');
            progressBarFill.style.cssText = `
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, var(--accent-color), #00ff88);
                border-radius: 4px;
                transition: width 0.3s ease;
                box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
            `;

            progressBarBg.appendChild(progressBarFill);
            progressContainer.appendChild(progressLabel);
            progressContainer.appendChild(progressBarBg);

            modalBody.appendChild(label);
            modalBody.appendChild(customFileBtn);
            modalBody.appendChild(fileInput);
            modalBody.appendChild(fileInfo);
            modalBody.appendChild(progressContainer);

            // Modal footer
            const modalFooter = document.createElement('div');
            modalFooter.style.cssText = `
                padding: 20px;
                border-top: 1px solid var(--glass-border);
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                background: var(--glass-bg);
                border-radius: 0 0 12px 12px;
            `;

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = cancelText;
            cancelBtn.className = 'app-btn secondary';

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = confirmText;
            confirmBtn.className = 'app-btn primary';
            confirmBtn.disabled = true;

            modalFooter.appendChild(cancelBtn);
            modalFooter.appendChild(confirmBtn);

            // Assemble modal
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(modalBody);
            modalContent.appendChild(modalFooter);
            modal.appendChild(modalContent);

            // Add to document
            document.body.appendChild(modal);

            // File selection handler
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    confirmBtn.disabled = false;

                    // Update custom button appearance
                    customFileBtn.innerHTML = `
                        <i class="fas fa-check-circle" style="color: var(--accent-color);"></i>
                        <span>${file.name}</span>
                    `;
                    customFileBtn.style.borderColor = 'var(--accent-color)';
                    customFileBtn.style.background = 'rgba(0, 212, 255, 0.15)';

                    fileInfo.style.display = 'block';
                    fileInfo.innerHTML = `
                        <p style="margin: 5px 0; color: var(--text-primary); font-size: 14px;">
                            <strong style="color: var(--accent-color);">Selected File:</strong> ${file.name}
                        </p>
                        <p style="margin: 5px 0; color: var(--text-primary); font-size: 14px;">
                            <strong style="color: var(--accent-color);">Size:</strong> ${(file.size / 1024).toFixed(1)} KB
                        </p>
                    `;
                } else {
                    confirmBtn.disabled = true;

                    // Reset custom button appearance
                    customFileBtn.innerHTML = `
                        <i class="fas fa-cloud-upload-alt"></i>
                        <span>Choose File to Upload</span>
                    `;
                    customFileBtn.style.borderColor = 'var(--glass-border)';
                    customFileBtn.style.background = 'rgba(0, 212, 255, 0.05)';

                    fileInfo.style.display = 'none';
                }
            });

            // Setup event handlers
            const closeModal = (selectedFile) => {
                modal.remove();
                resolve(selectedFile);
                document.removeEventListener('keydown', escapeHandler);
            };

            // Event listeners
            closeBtn.addEventListener('click', () => closeModal(null));
            cancelBtn.addEventListener('click', () => closeModal(null));
            confirmBtn.addEventListener('click', async () => {
                const file = fileInput.files[0];
                if (file && uploadCallback) {
                    // Show progress UI
                    progressContainer.style.display = 'block';
                    confirmBtn.disabled = true;
                    cancelBtn.disabled = true;
                    customFileBtn.style.display = 'none';
                    
                    // Progress callback function
                    const updateProgress = (percent) => {
                        progressBarFill.style.width = percent + '%';
                        progressContainer.querySelector('.progress-percent').textContent = Math.round(percent) + '%';
                    };
                    
                    try {
                        // Call the upload function with progress callback
                        const result = await uploadCallback(file, updateProgress);
                        closeModal(result);
                    } catch (error) {
                        // Hide progress and show error
                        progressContainer.style.display = 'none';
                        confirmBtn.disabled = false;
                        cancelBtn.disabled = false;
                        customFileBtn.style.display = 'block';
                        
                        // Show error in the modal
                        const errorDiv = document.createElement('div');
                        errorDiv.style.cssText = `
                            background: rgba(255, 71, 87, 0.1);
                            border: 1px solid rgba(255, 71, 87, 0.3);
                            border-radius: 6px;
                            padding: 10px;
                            margin-top: 10px;
                            color: #ff4757;
                        `;
                        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Upload failed: ${error.message}`;
                        modalBody.appendChild(errorDiv);
                        
                        // Remove error after 5 seconds
                        setTimeout(() => {
                            if (errorDiv.parentNode) {
                                errorDiv.remove();
                            }
                        }, 5000);
                    }
                } else if (file) {
                    // Fallback to regular modal behavior if no upload callback
                    closeModal(file);
                }
            });

            // Escape key to close
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal(null);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    },

    /**
     * Create a hamburger menu with customizable items
     * @param {HTMLElement} container - The container element to append the menu to
     * @param {Array} menuItems - Array of menu item objects
     * @param {object} [options={}] - Configuration options
     * @param {string} [options.position='right'] - Position of menu ('left' or 'right')
     * @param {string} [options.buttonClass=''] - Additional CSS classes for the button
     * @param {string} [options.menuId=''] - Custom ID for the menu (auto-generated if not provided)
     * @returns {object} Object with methods to control the menu
     * 
     * @example
     * const menuItems = [
     *   { icon: 'fas fa-sync-alt', text: 'Refresh', action: () => console.log('Refresh') },
     *   { icon: 'fas fa-folder-plus', text: 'New Folder', action: () => console.log('New Folder') },
     *   { type: 'separator' },
     *   { icon: 'fas fa-upload', text: 'Upload File', action: () => console.log('Upload') }
     * ];
     * 
     * const menu = sypnexAPI.createHamburgerMenu(container, menuItems, { position: 'right' });
     */
    createHamburgerMenu(container, menuItems, options = {}) {
        const {
            position = 'right',
            buttonClass = '',
            menuId = `hamburger-menu-${Date.now()}`
        } = options;

        // Create hamburger button
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = `hamburger-btn ${buttonClass}`;
        hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
        hamburgerBtn.style.cssText = `
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 6px;
            padding: 8px 12px;
            cursor: pointer;
            color: var(--text-primary);
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
        `;

        // Create dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.id = menuId;
        dropdownMenu.className = 'sypnex-dropdown-menu';
        dropdownMenu.style.cssText = `
            display: none;
            position: absolute;
            ${position}: 0;
            top: 100%;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            min-width: 180px;
            width: 180px;
            max-height: 70vh;
            overflow-y: auto;
            padding: 0;
            margin-top: 4px;
            backdrop-filter: blur(10px);
        `;

        // Populate menu items
        menuItems.forEach(item => {
            if (item.type === 'separator') {
                const separator = document.createElement('div');
                separator.style.cssText = `
                    height: 1px;
                    background: var(--glass-border);
                    margin: 4px 0;
                `;
                dropdownMenu.appendChild(separator);
            } else {
                const menuItem = document.createElement('button');
                menuItem.className = 'sypnex-menu-item';
                menuItem.innerHTML = `
                    <i class="${item.icon}" style="width: 16px; margin-right: 10px;"></i>
                    ${item.text}
                `;
                menuItem.style.cssText = `
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding: 10px 16px;
                    background: none;
                    border: none;
                    text-align: left;
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    font-size: 14px;
                `;

                menuItem.addEventListener('mouseenter', () => {
                    menuItem.style.background = 'var(--glass-hover)';
                });

                menuItem.addEventListener('mouseleave', () => {
                    menuItem.style.background = 'none';
                });

                menuItem.addEventListener('click', () => {
                    if (typeof item.action === 'function') {
                        item.action();
                    }
                    hideMenu();
                });

                dropdownMenu.appendChild(menuItem);
            }
        });

        // Setup container with relative positioning
        if (container.style.position !== 'relative' && container.style.position !== 'absolute') {
            container.style.position = 'relative';
        }

        // Append elements to container
        container.appendChild(hamburgerBtn);
        container.appendChild(dropdownMenu);

        // Show/hide functionality
        const showMenu = () => {
            dropdownMenu.style.display = 'block';
            hamburgerBtn.style.background = 'var(--glass-hover)';
        };

        const hideMenu = () => {
            dropdownMenu.style.display = 'none';
            hamburgerBtn.style.background = 'var(--glass-bg)';
        };

        const toggleMenu = () => {
            if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
                showMenu();
            } else {
                hideMenu();
            }
        };

        // Event listeners
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                hideMenu();
            }
        });

        // Hover effects for button
        hamburgerBtn.addEventListener('mouseenter', () => {
            if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
                hamburgerBtn.style.background = 'var(--glass-hover)';
            }
        });

        hamburgerBtn.addEventListener('mouseleave', () => {
            if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
                hamburgerBtn.style.background = 'var(--glass-bg)';
            }
        });

        // Return control object
        return {
            show: showMenu,
            hide: hideMenu,
            toggle: toggleMenu,
            button: hamburgerBtn,
            menu: dropdownMenu,
            destroy: () => {
                hamburgerBtn.remove();
                dropdownMenu.remove();
            }
        };
    }



});