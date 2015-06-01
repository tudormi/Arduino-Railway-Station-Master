package ro.mit.stationmaster.layout;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import ro.mit.stationmaster.dto.TrackDTO;
import java.util.ArrayList;

/**
 * Created by Tudormi on 15/5/2015.
 */
public class LayoutObserver {

    private final static Logger logger = LogManager.getLogger(LayoutObserver.class);

    @Autowired
    ArduinoMessageDispatcher arduinoMessageDispatcher;

    private ArrayList<Track> tracks;
    private ArrayList<Turnout> turnouts;

    LayoutObserver() {
        /* initially all the lines are empty with 0 speed */
        tracks = new ArrayList<Track>();
        for (int i = 0; i < 4; i++) {
            tracks.add(new Track(i+1, 0, "forward", "empty"));
        }
        /* initially all the turnouts are on the straight way */
        turnouts = new ArrayList<Turnout>();
        for (int i = 0; i < 6; i++) {
            turnouts.add(new Turnout(i+1, 0));
        }
    }

    /* singurul update venit de la Arduino momentan */
    public void updateLayoutFromArduino(IRSensor sensor) {
        /* daca linia este ocupata si macazele nu au fost facute pentru parasirea liniei
         * atunci cand unul din senzori este activat trenul sa se mai poate misca in
          * directia care se misca in acel moment*/
        tracks.get(sensor.getLineNumber() - 1).setState(sensor.getType());
    }

    public void updateLayout(TrackDTO trackDTO){
        /*se apeleaza aceasta metoda dupa validarea comenzii*/
//        System.out.println("am ajuns in update");
//        System.out.println(trackDTO.getDirection());
//        System.out.println(trackDTO.getNumber());
//        System.out.println(trackDTO.getSpeed());
        int lineNumber = trackDTO.getNumber();
        logger.info("Linia: " + lineNumber + " , viteza: " + trackDTO.getSpeed());
        tracks.get(lineNumber-1).setSpeed(trackDTO.getSpeed());
        tracks.get(lineNumber-1).setDirection(trackDTO.getDirection());
    }

    public int checkCommandValidity(TrackDTO trackDTO) {
        /* check if the you can move a train on the specific line */
        /**
         * daca linia este ocupata putem misca trenul doar pe linia respectiva pana la senzorii IR
         * daca trecem de un senzor IR nu mai putem misca trenul spre semnalul cel mai apropiat ci
         * doar in directia inversa
         * daca e ok se trimite comanda la arduino
         * apoi se face update la layout
         *
         *
         */
        if(trackDTO.getSpeed()>254){
            return 0;
        }
        else{
            int lineNumber = trackDTO.getNumber();
            if(tracks.get(lineNumber-1).getSpeed() > trackDTO.getSpeed() && (tracks.get(lineNumber-1).getSpeed()-trackDTO.getSpeed())>10){
                //ar trebui sa trimita mesaj mai rar cu o crestere treptata a vitezei
            }
            arduinoMessageDispatcher.sendTrackMessage(trackDTO);
        }
        updateLayout(trackDTO);

        return 1;
    }

    public int checkCommandValidity(Turnout turnout){
        /**
         * nu se poate pune un macaz ce ar duce catre o linie ocupata
         * macazele complementare trebuie schimbate simultan
         */


        return 1;
    }

    public int checkCommandValidity(Signal signal){
        /**
         * nu se poate pune un semnal pe liber daca linia este deja ocupata
         */

        return 1;
    }

    public Track getTrack(int trackNumber){
        return tracks.get(trackNumber);
    }

    public Turnout getTurnout(int turnoutNumber){
        return turnouts.get(turnoutNumber);
    }
}
