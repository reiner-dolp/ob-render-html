;;; ob-render-html.el --- org-babel functions for rendering HTML using headless chrome

;; Copyright (C) 2018 Reiner Dolp

;; Author: Reiner Dolp <hello@reinerdolp.com>
;; URL: http://github.com/reiner-dolp/ob-render-html
;; Keywords: org babel headless chrome render html
;; Version: 0.0.1
;; Package-Requires: ((org "8"))

;;; Commentary:
;;
;; org-babel functions for rendering HTML using headless chrome
;;

;;; Requirements:
;; You need to install node.js and chrome to use this extension.

;;; Code:
(require 'ob)

(defvar ob-render-html-base-dir (file-name-directory load-file-name))

(defconst org-babel-header-args:render-html
  '((width . :any)
    (height . :any)
    (scale . :any)
    (selector . :any))
  "render-html header arguments")

(defgroup ob-render-html nil
  "Render HTML in org-mode blocks."
  :group 'org)

(defcustom ob-render-html:width 800
  "viewport width of HTML screenshots"
  :group 'ob-render-html
  :type 'integer)

(defcustom ob-render-html:height 600
  "viewport width of HTML screenshots"
  :group 'ob-render-html
  :type 'integer)

(defcustom ob-render-html:scale 2
  "Device scale factor of HTML screenshots"
  :group 'ob-render-html
  :type 'integer)

(defcustom ob-render-html:selector ""
  "Device scale factor of HTML screenshots"
  :group 'ob-render-html
  :type 'string)

(defvar org-babel-default-header-args:render-html
  '((:results . "file")
    (:exports . "results"))
  "Default arguments for evaluating a render-html source block.")

(defun org-babel-execute:render-html (body params)
  "Execute a render-html block."
  (let* ((driving-script (concat ob-render-html-base-dir "ensure-dependencies.js"))
         (out (or (cdr (assoc :out params))
                  (error "render-html code blocks require a :out header argument")))
         (width (or (cdr (assoc :width params))
                            ob-render-html:width))
         (height (or (cdr (assoc :height params))
                    ob-render-html:height))
         (scale (or (cdr (assoc :scale params))
                     ob-render-html:scale))
         (selector (or (cdr (assoc :selector params))
                    ob-render-html:selector))
         (cmd (format "node '%s' %d %d %d '%s' %s" driving-script width height scale out selector)))
    (org-babel-eval cmd body)
    out))

(add-hook 'org-babel-after-execute-hook 'org-redisplay-inline-images)

(eval-after-load "org"
  '(add-to-list 'org-src-lang-modes '("render-html" . html)))

(provide 'ob-render-html)

;;; ob-render-html.el ends here
