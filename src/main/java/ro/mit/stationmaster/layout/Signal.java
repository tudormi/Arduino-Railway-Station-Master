package ro.mit.stationmaster.layout;

/**
 * Created by tmatrescu on 11/5/2015.
 */
public class Signal {

    private int number;
    private int type; //0 -x, y -1
    private String color;

    public Signal() {
    }

    public Signal(int number, int type, String color) {
        this.number = number;
        this.type = type;
        this.color = color;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Signal signal = (Signal) o;

        if (number != signal.number) return false;
        if (type != signal.type) return false;
        if (!color.equals(signal.color)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = number;
        result = 31 * result + type;
        result = 31 * result + color.hashCode();
        return result;
    }
}
