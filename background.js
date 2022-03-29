
chrome.contextMenus.create({
    title: `Open with vscode.dev`,
    id: 'open-with-vscode-dev',
    documentUrlPatterns: ["https://github.com/*/*"],
})

chrome.contextMenus.onClicked.addListener(() => {
    getCurrentTab()
        .then(tab => {
            openWithVScodeDev(tab.url)
        })
        .catch(err => console.error(err))
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') return

    const githubRepoRegex = new RegExp(/^(https?:\/\/[www.]*github\.com\/.{1,255})$/g)

    if (!githubRepoRegex.test(tab.url)) return

    chrome.scripting.executeScript({
        target: {
            tabId: tabId
        },
        files: [
            './clone-in-vscode.js'
        ],
    })
})

const getCurrentTab = async () => {
    const queryOptions = { active: true, currentWindow: true }
    const [tab] = await chrome.tabs.query(queryOptions)

    return tab
}

const openWithVScodeDev = (repoURL) => {
    chrome.tabs.create({
        url: `https://vscode.dev/${repoURL}`
    })
}