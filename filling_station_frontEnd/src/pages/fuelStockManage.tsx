import  { useEffect, useState } from "react";
import "../pages/fuelStockManage.css";
import "./myStations.css";
import { SideBar } from "./sidebar";
import type {
  AvailableFuelDetailCount,
  UserStation,
} from "../interface/stationDetailInterface";
import { getUserStationDetail } from "../services/stationService";
import { FaGasPump, FaTrash } from "react-icons/fa";
import type { FuelOption } from "./addStationMap";
import { UpdateFuelDetails } from "../services/fuelService";
import {
  confirmFuelDelete,
  showSuccessAlert,
  showErrorAlert,
  showWarningAlert,
  confirmDiscardChanges,
} from "../services/alertService";

const FuelStock = () => {
  const [userStation, setStation] = useState<UserStation[]>([]);
  const [fuelCountDetail, setFuelCountDetail] =
    useState<AvailableFuelDetailCount>({
      totalStock: 0,
      availableCount: 0,
      lowCount: 0,
      outOfStockCount: 0,
    });
  const [selectedStation, setSelectedStation] = useState<UserStation | null>(
    null,
  );
  const [selectedStationCopy, setSelectedStationCopy] =
    useState<UserStation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<FuelOption[]>([]);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await getUserStationDetail();
        setStation(response.data.station);
      } catch (error) {
        console.error("Failed to load station details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStation();
  }, []);

  useEffect(() => {
    if (!selectedStation?.fuels) {
      setFuelCountDetail({
        totalStock: 0,
        availableCount: 0,
        lowCount: 0,
        outOfStockCount: 0,
      });
      return;
    }

    let totalStock = 0;
    let availableCount = 0;
    let lowCount = 0;
    let outOfStockCount = 0;
    for (const fuelDt of selectedStation?.fuels) {
      totalStock += Number(fuelDt.currentStock || 0);

      const percentage =
        fuelDt.tankCapacity > 0
          ? (fuelDt.currentStock / fuelDt.tankCapacity) * 100
          : 0;
      if (percentage >= 75) {
        availableCount++;
      } else if (percentage > 1) {
        lowCount++;
      } else {
        outOfStockCount++;
      }
    }
    setFuelCountDetail({
      totalStock,
      availableCount,
      lowCount,
      outOfStockCount,
    });
    setSelectedItems(selectedStation.fuels);
  }, [selectedStation]);

  useEffect(() => {
    console.log("selected item", selectedItems);
    console.log("selected station", selectedStation);
  }, [selectedItems]);

  const discardBtn = async () => {
    if (!selectedStation) {
      await showWarningAlert("Please select a station first.");
      return;
    }
    const confirmed = await confirmDiscardChanges();

    if (!confirmed) return;

    setSelectedStation(selectedStationCopy);
    await showSuccessAlert("All unsaved changes have been discarded.");
  };

  const handleFieldChange = (
    fuelType: string,
    fieldDetail: string,
    fieldName: string,
  ) => {
    const fuelDetail = Number(fieldDetail) || 0;

    setSelectedStation((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        fuels: prev.fuels.map((fuel) =>
          fuel.fuelType === fuelType
            ? { ...fuel, [fieldName]: fuelDetail }
            : fuel,
        ),
      };
    });
  };

  const handleRemoveFuel = async (fuelType: string) => {
    const confirmed = await confirmFuelDelete(fuelType);

    if (!confirmed) return;

    setSelectedStation((prev) => {
      if (!prev) return prev;

      const updatedFuels = prev.fuels.filter(
        (fuel) => fuel.fuelType !== fuelType,
      );

      setSelectedItems(updatedFuels);

      return {
        ...prev,
        fuels: updatedFuels,
      };
    });
  };

  const updateFuel = async () => {
    if (!selectedStation?._id) {
      showWarningAlert("Station ID not found.");
      return;
    }

    try {
      await UpdateFuelDetails(selectedStation._id, selectedItems);

      await showSuccessAlert("Fuel stock details updated successfully.");
    } catch (error) {
      showErrorAlert("Unable to update fuel details. Please try again.");
    }
  };

  return (
    <div className="pump-dashboard">
      <SideBar />
      <main className="pump-main my-station-main">
        <div className="fuel-stock-container">
          {/* Header */}
          <div className="fuel-stock-header">
            <div>
              <h2>Fuel stock</h2>
              <p>
                Update fuel availability. Drivers see changes on the map as you
                save.
              </p>
            </div>

            <div className="header-actions">
              <button className="cancel-btn" onClick={discardBtn}>
                Discard
              </button>
              <button className="save-btn" onClick={updateFuel}>
                Save stock update
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="stock-summary">
            <div className="summary-card">
              <span>Total in stock</span>
              <h2>
                {fuelCountDetail.totalStock} <small>L</small>
              </h2>
            </div>

            <div className="summary-card">
              <span>Available</span>~
              <h2 className="green-text">{fuelCountDetail.availableCount} </h2>
            </div>

            <div className="summary-card">
              <span>Running low</span>
              <h2 className="yellow-text">{fuelCountDetail.lowCount} </h2>
            </div>

            <div className="summary-card">
              <span>Out of stock</span>
              <h2 className="red-text">{fuelCountDetail.outOfStockCount} </h2>
            </div>
          </div>

          <section className="station-selector">
            <div className="station-selector-heading">
              <div>
                <span className="station-section-kicker">WORKSPACE</span>
                <h2>My Stations</h2>
              </div>
              <span className="station-count">
                {userStation.length} station
                {userStation.length === 1 ? "" : "s"}
              </span>
            </div>

            {loading ? (
              <p className="station-selector-message">
                Loading your stations...
              </p>
            ) : userStation.length === 0 ? (
              <p className="station-selector-message">
                No stations registered yet.
              </p>
            ) : (
              <div className="station-selector-list">
                {userStation.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => {
                      setSelectedStation(item);

                      setSelectedStationCopy({
                        ...item,
                        fuels: item.fuels.map((fuel) => ({ ...fuel })),
                      });
                    }}
                    className={`station-selector-button ${
                      selectedStation?._id === item._id ? "active" : ""
                    }`}
                  >
                    <span className="station-selector-button-icon">
                      <FaGasPump />
                    </span>
                    <span className="station-selector-button-text">
                      <strong>{item.stationName}</strong>
                      <small>{item.stationAddress}</small>
                    </span>
                    <span className="station-selector-chevron">↗</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Fuel Cards */}
          <div className="fuel-cards-container">
            {selectedStation?.fuels.map((stationFuel) => {
              const percentage =
                stationFuel.tankCapacity > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (stationFuel.currentStock / stationFuel.tankCapacity) *
                          100,
                      ),
                    )
                  : 0;
              return (
                <div className="fuel-card">
                  <div className="fuel-card-header">
                    <h3>{stationFuel.fuelType}</h3>
                    <span
                      className={`status available ${
                        percentage >= 75
                          ? "high-stock"
                          : percentage >= 1
                            ? "low-stock"
                            : "out-of-stock"
                      }`}
                    >
                      {percentage >= 75
                        ? "available"
                        : percentage >= 1
                          ? "Low-stock"
                          : "out of stock"}
                    </span>
                  </div>

                  <div className="fuel-content">
                    <div className="fuel-level-container">
                      <div className="fuel-level">
                        <div
                          className={`fuel-level-fill ${
                            percentage >= 75
                              ? "high-stock"
                              : percentage >= 1
                                ? "low-stock"
                                : "out-of-stock"
                          }`}
                          style={{
                            height: `${percentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="fuel-inputs">
                      <label>Current stock (liters)</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={stationFuel.currentStock}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            handleFieldChange(
                              stationFuel.fuelType,
                              "0",
                              "currentStock",
                            );
                            return;
                          }

                          const numberValue = Number(value);
                          if (
                            numberValue >= 0 &&
                            numberValue <= stationFuel.tankCapacity
                          ) {
                            handleFieldChange(
                              stationFuel.fuelType,
                              value,
                              "currentStock",
                            );
                          } else {
                            showWarningAlert(
                              "Current stock cannot exceed the tank capacity.",
                            );
                          }
                        }}
                      />

                      <p className="capacity-text">
                        {percentage}% of {stationFuel.tankCapacity} L capacity
                      </p>

                      <label>Price per litre (Rs)</label>
                      <input
                        type="number"
                        value={stationFuel.fuelPrice}
                        min="0"
                        step="1"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || Number(value) < 0) {
                            handleFieldChange(
                              stationFuel.fuelType,
                              "0",
                              "fuelPrice",
                            );
                            return;
                          } else {
                            handleFieldChange(
                              stationFuel.fuelType,
                              value,
                              "fuelPrice",
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="delete-fuel-btn"
                    title="Remove fuel"
                    onClick={() => handleRemoveFuel(stationFuel.fuelType)}
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
            {!loading &&
              selectedStation &&
              selectedStation.fuels.length === 0 && (
                <p className="station-empty-state">
                  No fuel records available for this station.
                </p>
              )}
            {!loading && !selectedStation && userStation.length > 0 && (
              <p className="station-empty-state">
                Select a station to see current fuel stock.
              </p>
            )}
          </div>
        </div>
        <div className="fuel-card">
          <div className="station-selector-heading">
            <div>
              <span className="station-section-kicker">WORKSPACE</span>
              <h2>update your fuel stock</h2>
            </div>
            <div className="header-actions">
              <button className="cancel-btn" onClick={discardBtn}>
                Discard
              </button>
              <button className="save-btn" onClick={updateFuel}>
                Save stock update
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FuelStock;
