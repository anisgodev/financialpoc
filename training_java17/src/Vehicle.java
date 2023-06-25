non-sealed class Vehicle implements EngineBrand, Engine {

    private final String make, model, brand;

    private final int horsePower;

    public Vehicle(String make, String model, String brand, int horsePower) {
        this.make = make;
        this.model = model;
        this.brand = brand;
        this.horsePower = horsePower;
    }

    @Override
    public int getHorsePower() {
        return horsePower;
    }

    @Override
    public String getBrand() {
        return brand;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }
}
