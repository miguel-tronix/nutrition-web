/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package au.org.alfred.icu.nutrition.webservices;

import au.org.alfred.icu.nutrition.factories.AssesmentAndPlanObjectsFactory;
import au.org.alfred.icu.nutrition.persistence.Assesmentandplan;
import au.org.alfred.icu.nutrition.persistence.Review;
import au.org.alfred.icu.kinetic.library.helperfactories.XmlHelperFactory;
import au.org.alfred.icu.nutrition.plotting.NutritionPlotObject;
import java.io.StringReader;
import java.io.StringWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.ejb.Stateless;
import javax.xml.parsers.ParserConfigurationException;
import org.apache.cayenne.xml.XMLDecoder;
import org.apache.cayenne.xml.XMLEncoder;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 *
 * @author Miguel de Sousa
 */
@WebService(name = "NutritionNotesDataAccessBean", serviceName = "NutritionNotesDataAccessService", targetNamespace = "http://tempuri.org")
@Stateless()
public class NutritionNotesDataAccessBean {

    /**
     * Web service operation
     * @param AdmId Unique admission identifier
     * @return XML serialized list of Assesmentandplan objects assigned to single patient admission 
     */
    @WebMethod(operationName = "getAssesmentAndPlanObjects")
    public String getAssesmentAndPlanObjectsXML(@WebParam(name = "AdmId")
    String AdmId) {
        //TODO write your implementation code here:
        String rtn = "";
        Assesmentandplan aapo;
        List aapol = AssesmentAndPlanObjectsFactory.getAssesmentAndPlans(AdmId);
        rtn = new XMLEncoder().encode(aapol);
        AssesmentAndPlanObjectsFactory.getDataContext().rollbackChanges();
        return rtn;
    }

    /**
     * Web service operation
     * @param AdmId Unique Admission Identifier
     * @return XML Serialized Assesmentandplan Object With All Values Defaulted
     */
    @WebMethod(operationName = "getNewAssesmentAndPlanObject")
    public String getNewAssesmentAndPlanObjectXML(@WebParam(name = "AdmId")
    String AdmId) {
        //TODO write your implementation code here:org.w3c.dom.Document doc = XmlHelperFactory.buildXmlDocFromString(xml);
        String rtn ;
        Assesmentandplan aapo;
        aapo = AssesmentAndPlanObjectsFactory.getNewAssesmentAndPlan(AdmId);
        rtn = new XMLEncoder().encode(aapo);
        AssesmentAndPlanObjectsFactory.getDataContext().rollbackChanges();
        return rtn;
    }
    
    /**
     * Web service operation
     * @param xml   XML Serialized Assesmentandplan Object. 
     *              This Service Either Updates Or Creates A New Entry
     * @return Returns Either "fail" or "success" 
     */
    @WebMethod(operationName = "setAssesmentAndPlanObject")
    public String setAssesmentAndPlanObject(@WebParam(name = "xml")
    String xml) {
        //TODO write your implementation code here:
        String rtn = "fail";
        System.out.println(xml);
        XMLDecoder dcd = new XMLDecoder();
        Assesmentandplan aapo = (Assesmentandplan) dcd.decode(new StringReader(xml));
        if(AssesmentAndPlanObjectsFactory.setAssesmentAndPlanObject(aapo))
                rtn = "success";
        
        return rtn;
    }
    
     /**
     * Web service operation
     * @param xml   XML Serialized Review Object
     * @return Returns Either "fail" or "success"
     */
    @WebMethod(operationName = "setReviewObject")
    public String setReviewObject(@WebParam(name = "xml")
    String xml) {
        //TODO write your implementation code here:
        String rtn = "fail";
        System.out.println(xml);
        try
        {
            Document doc = XmlHelperFactory.buildXmlDocFromString(xml);
            NodeList anp = doc.getElementsByTagName("Assesmentandplan");
            NodeList review = doc.getElementsByTagName("Review");
            String axml = XmlHelperFactory.getTextFromNodeTransform(anp.item(0));
            String rxml  = XmlHelperFactory.getTextFromNodeTransform(review.item(0));
            XMLDecoder dcd = new XMLDecoder();
            //System.out.println("ANP: "+axml);
            Assesmentandplan aapo = (Assesmentandplan) dcd.decode(new StringReader(axml));
            List l = AssesmentAndPlanObjectsFactory.getAssessmentAndPlanMatchingObject(aapo);
            if(l.size() == 1)
                aapo = (Assesmentandplan) l.get(0);
            System.out.println("ANP: "+l.size());
            Review ro = (Review) dcd.decode(new StringReader(rxml));
            if(AssesmentAndPlanObjectsFactory.setReviewObject(ro, aapo))
                    rtn = "success";
        }
        catch(ParserConfigurationException ex)
        {
            rtn = "XML not formatted properly";
        }
        return rtn;
    }
    
    /**
     * Web service operation
     * @param xml   XML Serialized Review Object
     * @return Returns Either "fail" or "success"
     */
    @WebMethod(operationName = "removeReviewObject")
    public String removeReviewObject(@WebParam(name = "xml")
    String xml) {
        //TODO write your implementation code here:
        String rtn = "fail";
        System.out.println(xml);
        try
        {
            Document doc = XmlHelperFactory.buildXmlDocFromString(xml);
            NodeList anp = doc.getElementsByTagName("Assesmentandplan");
            NodeList review = doc.getElementsByTagName("Review");
            String axml = XmlHelperFactory.getTextFromNodeTransform(anp.item(0));
            String rxml  = XmlHelperFactory.getTextFromNodeTransform(review.item(0));
            XMLDecoder dcd = new XMLDecoder();
            Assesmentandplan aapo = (Assesmentandplan) dcd.decode(new StringReader(axml));
            List l = AssesmentAndPlanObjectsFactory.getAssessmentAndPlanMatchingObject(aapo);
            if(l.size() == 1)
                aapo = (Assesmentandplan) l.get(0);
            Review ro = (Review) dcd.decode(new StringReader(rxml));
            if(AssesmentAndPlanObjectsFactory.removeReviewObject(ro, aapo))
                    rtn = "success";
        }
        catch(ParserConfigurationException ex)
        {
            rtn = "XML not formatted properly";
        }
        return rtn;
    }
    
    /**
     * Web service operation
     * @return XML serialized review object will all values defaulted
     */
    @WebMethod(operationName = "getNewReviewObject")
    public String getNewReviewObjectXML() {
        //TODO write your implementation code here:
        String rtn = "";
        Review ro = AssesmentAndPlanObjectsFactory.getNewReviewObject();
        rtn = new XMLEncoder().encode(ro);
        AssesmentAndPlanObjectsFactory.getDataContext().rollbackChanges();
        return rtn;
    }
    
    /**
     * Web service operation
     * @param xml XML serialized Assesmentandplan object
     * @return XML serialized list of review objects assigned to the Assesmentandplan object
     */
    @WebMethod(operationName = "getReviewsForAssesmentAndPlanObject")
    public String getReviewsForAssesmentAndPlanObjectXML(@WebParam(name = "xml")
    String xml) {
        //TODO write your implementation code here:
        String rtn = "";
        Assesmentandplan aapo;
        XMLDecoder dcd = new XMLDecoder();
        System.out.println(xml);
        aapo = (Assesmentandplan) dcd.decode(new StringReader(xml));
        List l = AssesmentAndPlanObjectsFactory.getAssessmentAndPlanMatchingObject(aapo);
        if(l.size() > 0)
            aapo = (Assesmentandplan) l.get(0);
        List<Review> reviewArray = aapo.getReviewArray();
        rtn = new XMLEncoder().encode(reviewArray);
        AssesmentAndPlanObjectsFactory.getDataContext().rollbackChanges();
        return rtn;
    }

    /**
     * Web service operation
     * @param ICUAdmID Universal ICU admission number
     * @return An XML serialized list of objects with the format
     *         label
     *         received
     *         target
     *         date
     */
    @WebMethod(operationName = "getPlottingObjectsForPatient")
    public String getPlottingObjectsForPatient(@WebParam(name = "ID") final String ID, @WebParam(name="IDType") String idType, @WebParam(name="Sex") String sex, @WebParam(name="Age") String age) {
        //TODO write your implementation code here:
        
        java.util.TreeMap<Date,NutritionPlotObject> plots = new java.util.TreeMap<Date,NutritionPlotObject>();
        StringBuilder xmlList = new StringBuilder();
        xmlList.append("<root>");
        
        if(idType.equals("ICUAdmID"))
        {
          
                plots = (java.util.TreeMap<Date,NutritionPlotObject>) AssesmentAndPlanObjectsFactory.getPlotListForICUAdmId(ID, sex, Integer.parseInt(age));
        }
        else if(idType.equals("AdmID"))
        {
                plots = (java.util.TreeMap<Date,NutritionPlotObject>) AssesmentAndPlanObjectsFactory.getPlotListForAdmId(ID, sex, Integer.parseInt(age));
        }
        else if(idType.equals("PMIID"))
        {
                 plots = (java.util.TreeMap<Date,NutritionPlotObject>) AssesmentAndPlanObjectsFactory.getPlotListForPMIId(ID, sex, Integer.parseInt(age));
         }        
        
        Iterator p_itr = plots.keySet().iterator();
        while(p_itr.hasNext())
        {
            Date dd = (Date) p_itr.next();
            String pltStr = plots.get(dd).toString();
            xmlList.append(pltStr);
        }
        
        xmlList.append("</root>");
        
        return xmlList.toString();
    }

    /**
     * Web service operation
     * @param ICUAdmID ICU Admission ID
     * @return A number indicating the number of days since patient last recorded a bowel movement
     */
    @WebMethod(operationName = "getDaysSinceBowelMovementForICUAdmID")
    public String getDaysSinceBowelMovementForICUAdmID(@WebParam(name = "ICUAdmID") final String ICUAdmID) {
        //TODO write your implementation code here:
        int days ;
        days = AssesmentAndPlanObjectsFactory.getDaysSinceBowelMovementICU(ICUAdmID);
        return Integer.toString(days);
    }
    
     /**
     * Web service operation
     * @param AdmID Hospital Admission ID
     * @return A number indicating the number of days since patient last recorded a bowel movement
     */
    @WebMethod(operationName = "getDaysSinceBowelMovementForAdmID")
    public String getDaysSinceBowelMovementForAdmID(@WebParam(name = "AdmID") final String AdmID) {
        //TODO write your implementation code here:
        int days ;
        days = AssesmentAndPlanObjectsFactory.getDaysSinceBowelMovementHosp(AdmID);
        return Integer.toString(days);
    }
    
    /***
     * Web Service Operation
     * @param enTargetRate  Enteral Nutrition Target Rate (ml/hour)
     * @param enHoursFeed   Enteral Nutrition Hours per feed
     * @param enFormula Enteral Nutrition Formula Used
     * @param pnTargetRate  Parenteral Nutrition Target Rate (ml/hour)
     * @param pnHoursFeed Parenteral Nutrition Hours per feed
     * @param pnFormula Parenteral Formula Used
     * @param onEstimateProtein Oral Nutrition Estimate Protein (G/day)
     * @return Double value passed as a string
     */
    @WebMethod(operationName="calculateTotalProtein")
    public String calculateTotalDailyProtein(@WebParam(name="enTargetRate") final String enTargetRate,
                                             @WebParam(name="enHoursFeed") final String enHoursFeed,
                                             @WebParam(name="enFormula") final String enFormula,
                                             @WebParam(name="pnTargetRate") final String pnTargetRate,
                                             @WebParam(name="pnHoursFeed") final String pnHoursFeed,
                                             @WebParam(name="pnFormula") final String pnFormula,
                                             @WebParam(name="onEstimateProtein") final String onEstimateProtein)
    {
        Double totalProteinProvided = AssesmentAndPlanObjectsFactory.calculateTotalDailyProtein(Double.parseDouble(enTargetRate),
                                                                                                Double.parseDouble(enHoursFeed),
                                                                                                Integer.parseInt(enFormula),
                                                                                                Double.parseDouble(pnTargetRate),
                                                                                                Double.parseDouble(pnHoursFeed),
                                                                                                Integer.parseInt(pnFormula),
                                                                                                Double.parseDouble(onEstimateProtein));
        
        return String.valueOf(totalProteinProvided);
    }
    
    
    /***
     * Web Service Operation
     * @param enTargetRate  Enteral Nutrition Target Rate (ml/hour)
     * @param enHoursFeed   Enteral Nutrition Hours per feed
     * @param enFormula Enteral Nutrition Formula Used
     * @param pnTargetRate  Parenteral Nutrition Target Rate (ml/hour)
     * @param pnHoursFeed Parenteral Nutrition Hours per feed
     * @param pnFormula Parenteral Formula Used
     * @param onEstimateEnergy  Oral Nutrition Estimate Energy (Mj/day)
     * @param weight    Weight of patient (Kg)
     * @param units Either MJ for MegaJoules or KCal for Kilo Calories/Kg/day
     * @return Double values passed as a string
     */
    
    @WebMethod(operationName="calculateTotalEnergy")
    public String calculateTotalDailyEnergy(@WebParam(name="enTargetRate") final String enTargetRate,
                                             @WebParam(name="enHoursFeed") final String enHoursFeed,
                                             @WebParam(name="enFormula") final String enFormula,
                                             @WebParam(name="pnTargetRate") final String pnTargetRate,
                                             @WebParam(name="pnHoursFeed") final String pnHoursFeed,
                                             @WebParam(name="pnFormula") final String pnFormula,
                                             @WebParam(name="onEstimateEnergy") final String onEstimateEnergy,
                                             @WebParam(name="weight") final String weight,
                                             @WebParam(name="units") final String units)
    {
        Double totalEnergyProvided = AssesmentAndPlanObjectsFactory.calculateTotalDailyEnergy(Double.parseDouble(enTargetRate),
                                                                                              Double.parseDouble(enHoursFeed),
                                                                                              Integer.parseInt(enFormula),
                                                                                              Double.parseDouble(pnTargetRate),
                                                                                              Double.parseDouble(pnHoursFeed),
                                                                                              Integer.parseInt(pnFormula),
                                                                                              Double.parseDouble(onEstimateEnergy),
                                                                                              Double.parseDouble(weight),
                                                                                              units);
        
        return String.valueOf(totalEnergyProvided);
    }

    @WebMethod(operationName="getPrevious5ReviewCommentsForPatient")
    public String getPrevious5ReviewCommentsForPatient(@WebParam(name="PMIID") final String PMIID) {
        List<Review> reviews;
        reviews = AssesmentAndPlanObjectsFactory.getPrevious5ReviewsForPatient(PMIID);
        StringWriter wrt = new StringWriter();
        DateFormat df = new SimpleDateFormat("EEEE, dd MMMM yyyy");
        if(reviews.size() > 0)
        {
            wrt.append("<root>");
            Iterator itr = reviews.iterator();
            while(itr.hasNext()){
                Review cmt = (Review) itr.next();
                if(!cmt.getReviewComment().equals("none"))
                {
                    wrt.append("<review>");
                    wrt.append("<reviewComment>");
                    wrt.append(cmt.getReviewComment());
                    wrt.append("</reviewComment>");
                    wrt.append("<reviewDate>");
                    wrt.append(df.format(cmt.getReviewDate()));
                    wrt.append("</reviewDate>");
                    wrt.append("</review>");
                }
            }
            wrt.append("</root>");
        }
        
        return wrt.toString();
    }
    

    

}
