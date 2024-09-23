// script.js

document.addEventListener("DOMContentLoaded", () => {
    const investmentForm = document.getElementById("investmentForm");
    const addInvestmentBtn = document.getElementById("addInvestmentBtn");
    const submitInvestment = document.getElementById("submitInvestment");
    const investmentTable = document.getElementById("investmentTable").querySelector("tbody");
    const totalValueElement = document.getElementById("totalValue");
    const chartCanvas = document.getElementById("chartCanvas");

    let investments = JSON.parse(localStorage.getItem("investments")) || [];

    function updateTotalValue() {
        const totalValue = investments.reduce((acc, investment) => acc + investment.currentValue, 0);
        totalValueElement.textContent = totalValue.toFixed(2);
    }

    function calculatePercentageChange(investment) {
        return ((investment.currentValue - investment.amountInvested) / investment.amountInvested * 100).toFixed(2);
    }

    function renderInvestments() {
        investmentTable.innerHTML = "";
        investments.forEach((investment, index) => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = investment.assetName;
            row.appendChild(nameCell);

            const investedCell = document.createElement("td");
            investedCell.textContent = `$${investment.amountInvested.toFixed(2)}`;
            row.appendChild(investedCell);

            const currentCell = document.createElement("td");
            currentCell.textContent = `$${investment.currentValue.toFixed(2)}`;
            row.appendChild(currentCell);

            const changeCell = document.createElement("td");
            changeCell.textContent = `${calculatePercentageChange(investment)}%`;
            row.appendChild(changeCell);

            const actionsCell = document.createElement("td");
            const updateBtn = document.createElement("button");
            updateBtn.textContent = "Update";
            updateBtn.addEventListener("click", () => updateInvestment(index));
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", () => removeInvestment(index));
            actionsCell.appendChild(updateBtn);
            actionsCell.appendChild(removeBtn);
            row.appendChild(actionsCell);

            investmentTable.appendChild(row);
        });

        updateTotalValue();
        renderChart();
    }

    function renderChart() {
        const assetNames = investments.map(inv => inv.assetName);
        const assetValues = investments.map(inv => inv.currentValue);

        const ctx = document.getElementById('chartCanvas').getContext('2d');
        if (window.portfolioChart) window.portfolioChart.destroy();
        window.portfolioChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: assetNames,
                datasets: [{
                    data: assetValues,
                    backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#f77825'],
                }]
            }


        });

    }
    document.addEventListener("DOMContentLoaded", function() {
        setTimeout(renderChart, 100);
    });

    function addInvestment() {
        const assetName = document.getElementById("assetName").value.trim();
        const amountInvested = parseFloat(document.getElementById("amountInvested").value);
        const currentValue = parseFloat(document.getElementById("currentValue").value);

        if (assetName && !isNaN(amountInvested) && !isNaN(currentValue) && amountInvested > 0 && currentValue >= 0) {
            investments.push({ assetName, amountInvested, currentValue });
            localStorage.setItem("investments", JSON.stringify(investments));
            renderInvestments();
            investmentForm.reset();
            investmentForm.classList.add("hidden");
        } else {
            alert("Please enter valid data for all fields.");
        }
    }

    function updateInvestment(index) {
        const newValue = parseFloat(prompt("Enter the new current value:", investments[index].currentValue));
        if (!isNaN(newValue) && newValue >= 0) {
            investments[index].currentValue = newValue;
            localStorage.setItem("investments", JSON.stringify(investments));
            renderInvestments();
        } else {
            alert("Please enter a valid number.");
        }
    }

    function removeInvestment(index) {
        investments.splice(index, 1);
        localStorage.setItem("investments", JSON.stringify(investments));
        renderInvestments();
    }

    addInvestmentBtn.addEventListener("click", () => {
        investmentForm.classList.toggle("hidden");
    });

    submitInvestment.addEventListener("click", addInvestment);

    renderInvestments();
});