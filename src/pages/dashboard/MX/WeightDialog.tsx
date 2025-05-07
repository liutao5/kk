import { setMXWeight } from "@/api/mainApi";
import DialogForm from "@/components/dialog-form";
import RHFInput from "@/components/hook-form/RHFInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, TextField } from "@mui/material";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";
import { MX } from ".";

interface WeightItem {
    weights?: {
        weight: number;
    }[]
}

interface WeightDialogProps {
    open: boolean;
    onClose: () => void;
    selectedMX: MX[]
}

const WeightDialog: FC<WeightDialogProps> = ({open, onClose, selectedMX}) => {
    console.log('selectedMX', selectedMX)
    const WeightSchema = Yup.object().shape({
        weights: Yup.array().of(
            Yup.object().shape({
                weight: Yup.number().required('请输入重量').typeError('请输入重量')
            })
        ),
      });
      const values = {
        weights: selectedMX?.map(item => ({weight: item.weight || 0})),
      };
    
      const methods = useForm<WeightItem>({
        resolver: yupResolver(WeightSchema),
        values: values
      });
    
      const { handleSubmit, reset, control } = methods;

      const { fields } = useFieldArray({
        control,
        name: 'weights'
      })
    
      const handleClose = () => {
        onClose()
      };
    
      const onSubmit = (data: WeightItem) => {
        const { weights} = data
        const params = selectedMX?.map((mx, index) => ({id: mx.id, weight: weights?.[index].weight}))
        setMXWeight(params).then(res => {
            if (res.data.code === 200) {
                reset()
                handleClose()
              }
        })
      };
    return <DialogForm title="登记重量" open={open} methods={methods} maxWidth="sm" onSubmit={handleSubmit(onSubmit)} onClose={handleClose}>
        
        {fields?.map((field,index) => <Stack key={field.id} sx={{ p: 2 }} spacing={2} direction="row">
            <TextField
                label="批次号"
                value={selectedMX[index]?.batchCode}
                size="small"
                fullWidth
                InputProps={{
                    readOnly: true,
                }}
            />
            <TextField
                label="配方名"
                value={selectedMX[index]?.recipeName}
                size="small"
                fullWidth
                InputProps={{
                    readOnly: true,
                }}
            />
            <RHFInput
                label="重量"
                name={`weights.${index}.weight`}
                size="small"
                placeholder="请输入重量"
            />
        </Stack>)}
    </DialogForm>
}

export default WeightDialog